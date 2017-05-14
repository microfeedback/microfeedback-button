import './wishes-button.css';
import sendJSON from './send-json';
import takeScreenshot from './take-screenshot';

const hasHTML2Canvas = window.html2canvas;
// Less typing
const d = document;

let globalID = 0;  // used to create unique CSS IDs for inserted elements

const Button = options => `<a class="wishes-feedback-button" href="#">${options.open}</a>`;

const Dialog = options => `
  <div style="display: none;" class="wishes-dialog">
    <form class="wishes-form" action="">
    <h5 class="wishes-dialog-title">${options.title}</h5>
    <a class="wishes-dialog-close" href="#">&times;</a>
    <textarea class="wishes-text" rows="${options.rows}"
           placeholder="${options.placeholder}" maxlength="${options.maxLength}"></textarea>
    <div class="wishes-screenshot" style="display: ${options.screenshot ? '' : 'none'}">
      <input class="wishes-screenshot-checkbox" type="checkbox" /> <span>Include screenshot</span>
      <div class="wishes-screenshot-preview"></div>
    </div>
    <button class="wishes-button wishes-button-submit" type="submit">${options.send}</button>
    <button class="wishes-button wishes-button-cancel" type="button">Cancel</button>
    </form>
  </div>
`;

const noop = () => {};

const DIALOG_ID = '__wishes-dialog';

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
};
class WishesButton {
  constructor(element, options) {
    const opts = element instanceof HTMLElement ? options : element;
    this.options = Object.assign({}, defaults, opts);
    // Either null or a promise to a Capture (if "Include Screenshot" is checked)
    if (this.options.screenshot && !hasHTML2Canvas) {
      throw new Error('html2canvas required for screenshot capability');
    }
    this.screenshot = null;
    this.listeners = [];

    // Ensure that the dialog HTML is inserted only once
    this.dialogParent = d.getElementById(DIALOG_ID);
    let dialogCreated = false;
    if (!this.dialogParent) {
      dialogCreated = true;
      this.dialogParent = d.createElement('div');
      this.dialogParent.id = DIALOG_ID;
      this.dialogParent.innerHTML = Dialog(this.options);
      d.body.appendChild(this.dialogParent);
    }

    if (element instanceof HTMLElement) {
      this.$button = element;
    } else {  // assume element is an object
      const newID = globalID++;
      const buttonParent = d.createElement('div');
      buttonParent.id = `__wishes-button-${newID}`;
      buttonParent.innerHTML = Button(this.options);
      d.body.appendChild(buttonParent);
      this.$button = buttonParent.querySelector('.wishes-feedback-button');
    }

    this.addListener(this.$button, 'click', this.onClick.bind(this));

    this.$dialog = this.dialogParent.querySelector('.wishes-dialog');
    this.$input = this.$dialog.querySelector('.wishes-text');
    this.$close = this.$dialog.querySelector('.wishes-dialog-close');
    this.$cancel = this.$dialog.querySelector('.wishes-button-cancel');
    this.$form = this.$dialog.querySelector('.wishes-form');
    this.$screenshot = this.$dialog.querySelector('.wishes-screenshot-checkbox');
    this.$screenshotPreview = this.$dialog.querySelector('.wishes-screenshot-preview');
    this.$submit = this.$dialog.querySelector('.wishes-button-submit');

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
  show() {
    this.$button.style.display = '';
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
    this.show();
    this.$input.value = '';
    this.$screenshot.checked = false;
    this.$screenshotPreview.innerHTML = '';
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
    const value = this.$input.value;
    if (value.length < 1 || value.length > this.options.maxLength) {
      this.onValidationFail(value);
      return false;
    }
    if (this.options.url !== false) {
      this.submit(value).then((res) => {
        if (res.backend.name === 'github') {
          // TODO: Make this a proper dialog
          alert(`Posted a new issue at: ${res.result.html_url}`);
        } else {
          // TODO: Make this a proper dialog
          alert('Thank you for your feedback!');
        }
      });
    } else {
      console.log(`Value: ${value}`); // eslint-disable-line
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

const factory = options => new WishesButton(options);
factory.WishesButton = WishesButton;
factory.takeScreenshot = takeScreenshot;
export default factory;
