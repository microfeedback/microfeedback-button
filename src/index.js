import './wishes-button.css';

// Less typing
const $ = document.querySelector.bind(document);
const d = document;
const on = (elm, name, fn) => elm.addEventListener(name, fn, false);

let globalID = 0;  // used to create unique CSS IDs for inserted elements

const Button = options => `<a class="wishes-button" href="#">${options.open}</a>`;

const Dialog = options => `
  <div style="display: none;" class="wishes-dialog">
    <form action="">
    <h5 class="wishes-dialog-title">${options.title}</h5>
    <a class="wishes-dialog-close" href="#">&times;</a>
    <input class="wishes-text"
           type="text" placeholder="${options.placeholder}" maxlength="${options.maxLength}" />
    <input class="wishes-submit" type="submit" value="${options.send}" />
    </form>
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

    const newID = globalID++;
    this.elm = d.createElement('div');
    const id = this.elm.id = `__wishes-button-${newID}`;
    this.elm.innerHTML = Button(this.options) + Dialog(this.options);
    d.body.appendChild(this.elm);

    this.$button = $(`#${id} .wishes-button`);
    on(this.$button, 'click', this.onClick.bind(this));

    this.$dialog = $(`#${id} .wishes-dialog`);
    this.$input = $(`#${id} .wishes-text`);
    this.$close = $(`#${id} .wishes-dialog-close`);
    this.$submit = $(`#${id} .wishes-submit`);
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
    this.elm && d.body.removeChild(this.elm);
  }
}

const factory = options => new WishesButton(options);
factory.WishesButton = WishesButton;
export default factory;
