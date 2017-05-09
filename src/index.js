import './wishes-button.css';

// Less typing
const $ = document.querySelector.bind(document);
const d = document;
const on = (elm, name, fn) => elm.addEventListener(name, fn, false);
const off = (elm, name, fn) => elm.removeEventListener(name, fn, false);

const Button = options => `<a id="wishes-button" href="#">${options.open}</a>`;

const Dialog = options => `
  <div id="wishes-dialog">
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
    this.show();
  }
  show() {
    d.body.innerHTML += Button(this.options);
    on($('#wishes-button'), 'click', this.onClick.bind(this));
  }
  hide() {
    const $button = $('#wishes-button');
    $button.removeEventListener('click', this.onClick.bind(this), false);
    d.body.removeChild($button);
  }
  showDialog() {
    d.body.innerHTML += Dialog(this.options);
    const $input = $('#wishes-text');
    const $close = $('#wishes-dialog-close');
    const $submit = $('#wishes-submit');

    $input.focus();

    on($close, 'click', this.onDismiss.bind(this));
    // TODO: Handle form submit
    on($submit, 'click', this.onSubmit.bind(this));
  }
  hideDialog() {
    off($('#wishes-dialog-close'), 'click', this.onDismiss.bind(this));
    off($('#wishes-submit'), 'click', this.onSubmit.bind(this));
    d.body.removeChild($('#wishes-dialog'));
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
      if (res.backend.name === 'github') {
        console.log('TODO: Show dialog with issue URL');
      }
    };
  }
  onSubmit(e) {
    e && e.preventDefault();
    const $input = $('#wishes-text');
    const value = $input.value;
    if (value.length < 1 || value.length > this.options.maxLength) {
      $input.style.border = '2px solid #c00';
      $input.focus();
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
  destroy() {  // eslint-disable-line
    const $button = $('wishes-button');
    const $dialog = $('wishes-dialog');
    $button && d.body.removeChild($button);
    $dialog && d.body.removeChild($dialog);
  }
}

const factory = options => new WishesButton(options);
factory.WishesButton = WishesButton;
export default factory;
