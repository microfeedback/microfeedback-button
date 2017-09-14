import './microfeedback-button.css';
import sendJSON from './send-json';
import takeScreenshot from './take-screenshot';

const hasHTML2Canvas = window.html2canvas;
// Less typing
const d = document;

let globalID = 0; // used to create unique CSS IDs for inserted elements

const Button = options => `<a class="microfeedback-button" href="#">${options.open}</a>`;

const Dialog = options => `
  <div style="display: none;" class="microfeedback-dialog">
    <form class="microfeedback-form" action="n">
    <h5 class="microfeedback-dialog-title">${options.title}</h5>
    <a class="microfeedback-dialog-close" href="#">&times;</a>
    <textarea class="microfeedback-text" rows="${options.rows}"
           placeholder="${options.placeholder}" maxlength="${options.maxLength}"></textarea>
    <div class="microfeedback-screenshot" style="display: ${options.screenshot ? '' : 'none'}">
      <input class="microfeedback-screenshot-checkbox" type="checkbox" /> <span>Include screenshot</span>
      <div class="microfeedback-screenshot-preview"></div>
    </div>
    <button class="microfeedback-form-button microfeedback-button-submit" type="submit">${options.send}</button>
    <button class="microfeedback-form-button microfeedback-button-cancel" type="button">Cancel</button>
    </form>
  </div>
`;

const noop = () => {};

const defaults = {
  url: null,
  open: 'Feedback',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  send: 'Send',
  maxLength: 500,
  rows: 5,
  onSubmit: noop,
  extra: null,
  screenshot: false,
  append: false,
};
class MicroFeedbackButton {
  constructor(element, options) {
    const opts = element instanceof HTMLElement ? options : element;
    this.options = Object.assign({}, defaults, opts);
    // Either null or a promise to a Capture (if "Include Screenshot" is checked)
    if (this.options.screenshot && !hasHTML2Canvas) {
      throw new Error('html2canvas required for screenshot capability');
    }
    this.screenshot = null;
    this.listeners = [];
    const newID = globalID++;

    // Ensure that the dialog HTML is inserted only once
    const dialogID = this.options.append ? `__microfeedback-dialog-${newID}` : '__microfeedback-dialog';
    this.dialogParent = d.getElementById(dialogID);
    let dialogCreated = false;
    if (!this.dialogParent || this.options.append) {
      dialogCreated = true;
      this.dialogParent = d.createElement('div');
      this.dialogParent.id = dialogID;
      this.dialogParent.innerHTML = Dialog(this.options);
      d.body.appendChild(this.dialogParent);
    }

    if (element instanceof HTMLElement) {
      this.$button = element;
    } else { // assume element is an object
      const buttonParent = d.createElement('div');
      buttonParent.id = `__microfeedback-button-${newID}`;
      buttonParent.innerHTML = Button(this.options);
      d.body.appendChild(buttonParent);
      this.$button = buttonParent.querySelector('.microfeedback-button');
    }

    this.addListener(this.$button, 'click', this.onClick.bind(this));

    this.$dialog = this.dialogParent.querySelector('.microfeedback-dialog');
    this.$input = this.$dialog.querySelector('.microfeedback-text');
    this.$close = this.$dialog.querySelector('.microfeedback-dialog-close');
    this.$cancel = this.$dialog.querySelector('.microfeedback-button-cancel');
    this.$form = this.$dialog.querySelector('.microfeedback-form');
    this.$screenshot = this.$dialog.querySelector('.microfeedback-screenshot-checkbox');
    this.$screenshotPreview = this.$dialog.querySelector('.microfeedback-screenshot-preview');
    this.$submit = this.$dialog.querySelector('.microfeedback-button-submit');

    if (dialogCreated) {
      this.addListener(this.$screenshot, 'change', this.onChangeScreenshot.bind(this));
      this.addListener(this.$close, 'click', this.onDismiss.bind(this));
      this.addListener(this.$cancel, 'click', this.onDismiss.bind(this));
      this.addListener(this.$form, 'submit', this.onSubmit.bind(this));
    }
  }
  addListener(elm, event, handler) {
    elm.addEventListener(event, handler, false);
    this.listeners.push([elm, event, handler]);
  }
  showDialog() {
    this.$dialog.style.display = '';
    this.$input.focus();
  }
  hideDialog() {
    this.$dialog.style.display = 'none';
  }
  onChangeScreenshot(e) {
    if (e.target.checked) {
      this.screenshot = takeScreenshot(this.options.screenshot).then((capture) => {
        this.$screenshotPreview.appendChild(capture.thumbnail());
        return capture;
      });
    } else {
      this.screenshot = null;
      this.$screenshotPreview.innerHTML = '';
    }
  }
  onClick(e) {
    e && e.preventDefault();
    this.showDialog();
  }
  onDismiss(e) {
    e && e.preventDefault();
    this.hideDialog();
    this.$input.value = '';
    this.$screenshot.checked = false;
    this.$screenshotPreview.innerHTML = '';
    this.screenshot = null;
    this.$input.style.border = '';
  }
  sendRequest(payload) {
    return sendJSON({
      method: 'POST',
      url: this.options.url,
      payload,
    });
  }
  submit(body) {
    const payload = { body };
    if (this.options.extra) {
      payload.extra = this.options.extra;
    }
    return new Promise((resolve, reject) => {
      if (this.options.screenshot && this.screenshot) {
        this.screenshot.then((capture) => {
          if (capture) {
            capture.upload().then((imageURL) => {
              payload.screenshotURL = imageURL;
              this.sendRequest(payload).then(resolve, reject);
            });
          } else {
            this.sendRequest(payload).then(resolve, reject);
          }
        }, reject);
      } else {
        this.sendRequest(payload).then(resolve, reject);
      }
    });
  }
  onValidationFail() {
    this.$input.style.border = '2px solid #c00';
    this.$input.focus();
  }
  onSubmit(e) {
    e && e.preventDefault();
    const { value } = this.$input;
    if (value.length < 1 || value.length > this.options.maxLength) {
      this.onValidationFail(value);
      return false;
    }
    if (this.options.url !== false) {
      this.submit(value).then((res) => {  // eslint-disable-line
        // TODO: Show a proper dialog after feedback is submitted
        // if (res.backend.name === 'github') {
        //   alert(`Posted a new issue at: ${res.result.html_url}`);
        // } else {
        //   alert('Thank you for your feedback!');
        // }
      });
    } else {
      console.log(`Feedback submitted: ${value}`); // eslint-disable-line
    }
    this.onDismiss();
    this.options.onSubmit(e, value);
    return true;
  }
  destroy() {
    this.dialogParent && d.body.removeChild(this.dialogParent);
    this.listeners.forEach((each) => {
      each[0].removeEventListener(each[1], each[2], false);
    });
  }
}

const factory = (element, options) => new MicroFeedbackButton(element, options);
factory.MicroFeedbackButton = MicroFeedbackButton;
factory.takeScreenshot = takeScreenshot;
export default factory;
