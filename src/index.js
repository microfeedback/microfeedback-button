import './wishes-button.css';

// Less typing
const $ = document.querySelector.bind(document);
const d = document;
const on = (elm, name, fn) => elm.addEventListener(name, fn, false);
const insertElement = (html) => {
  const elm = d.createElement('div');
  elm.innerHTML = html;
  d.body.appendChild(elm);
};

// TODO: Don't rely on CSS IDs.
const Button = options => `<a id="wishes-button" href="#">${options.open}</a>`;

const Dialog = options => `
  <div style="display: none;" id="wishes-dialog">
    <h5 class="wishes-dialog-title">${options.title}</h5>
    <a id="wishes-dialog-close" href="#">&times;</a>
    <input id="wishes-text"
           type="text" placeholder="${options.placeholder}" maxlength="${options.maxLength}" />
    <a id="wishes-submit" href="#">${options.send}</a>
  </div>
`;

const noop = () => {};

class WishesButton {
  // prettier-ignore
  // TODO: Allow an element or URL to be passed as first argument
  constructor({
    url = null,
    open = 'Feedback',
    title = 'Send feedback',
    placeholder = 'Describe your issue or share your ideas',
    send = 'Send',
    maxLength = 500,
    onSubmit = noop,
  } = {}) {
    this.options = {
      url,
      open,
      title,
      placeholder,
      send,
      maxLength,
      onSubmit,
    };

    insertElement(Button(this.options));
    insertElement(Dialog(this.options));

    this.$button = $('#wishes-button');
    on(this.$button, 'click', this.onClick.bind(this));

    this.$dialog = $('#wishes-dialog');
    this.$input = $('#wishes-text');
    this.$close = $('#wishes-dialog-close');
    this.$submit = $('#wishes-submit');
    on(this.$close, 'click', this.onDismiss.bind(this));
    // TODO: Handle form submit
    on(this.$submit, 'click', this.onSubmit.bind(this));
  }
  show() {
    this.$button.style.display = '';
  }
  hide() {
    this.$button.style.display = 'none';
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
    this.hide();
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
    req.open('POST', this.options.url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    req.send(JSON.stringify(payload));
    req.onload = () => {
      const res = JSON.parse(req.response);
      // TODO: Add hook
      if (res.backend.name === 'github') {
        console.log('TODO: Show dialog with issue URL');
      } else {
        console.log('TODO: Show thank you dialog.');
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
    this.$button && d.body.removeChild(this.$button.parentElement);
    this.$dialog && d.body.removeChild(this.$dialog.parentElement);
  }
}

const factory = options => new WishesButton(options);
factory.WishesButton = WishesButton;
export default factory;
