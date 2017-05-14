import './wishes-button.css';

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
};
class WishesButton {
  constructor(element, options) {
    const opts = element instanceof HTMLElement ? options : element;
    this.options = Object.assign({}, defaults, opts);
    this.listeners = [];

    // Ensure that the dialog HTML is inserted only once
    this.dialogParent = d.getElementById(DIALOG_ID);
    if (!this.dialogParent) {
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
    this.$submit = this.$dialog.querySelector('.wishes-submit');
    this.addListener(this.$close, 'click', this.onDismiss.bind(this));
    this.addListener(this.$cancel, 'click', this.onDismiss.bind(this));
    this.addListener(this.$form, 'submit', this.onSubmit.bind(this));
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
  onClick(e) {
    e && e.preventDefault();
    this.showDialog();
  }
  onDismiss(e) {
    e && e.preventDefault();
    this.hideDialog();
    this.show();
    this.$input.value = '';
  }
  sendRequest(body) {
    const req = new XMLHttpRequest();
    const payload = { body };
    if (this.options.extra) {
      payload.extra = this.options.extra;
    }
    req.open('POST', this.options.url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    req.send(JSON.stringify(payload));
    req.onload = () => {
      const res = JSON.parse(req.response);
      // TODO: Add hook
      if (res.backend.name === 'github') {
        // TODO: Make this a proper dialog
        alert(`Posted a new issue at: ${res.result.html_url}`);
      } else {
        // TODO: Make this a proper dialog
        alert('Thank you for your feedback!');
      }
    };
  }
  onSubmit(e) {
    e && e.preventDefault();
    const value = this.$input.value;
    if (value.length < 1 || value.length > this.options.maxLength) {
      this.$input.style.border = '2px solid #c00';
      this.$input.focus();
      return false;
    }
    if (this.options.url !== false) {
      this.sendRequest(value);
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
export default factory;
