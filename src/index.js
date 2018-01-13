import swal from 'sweetalert2';
import './microfeedback-button.css';
import sendJSON from './send-json';

// Less typing
const d = document;

let globalID = 0; // used to create unique CSS IDs for inserted elements

const makeButton = options => `<button aria-label="${options.ariaLabel}" style="background-color: ${options.backgroundColor}; color: ${options.color}" class="microfeedback-button">${options.text}</button>`;
const defaults = {
  url: null,
  text: 'Feedback',
  ariaLabel: 'Send feedback',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  extra: null,
  backgroundColor: '#3085d6',
  color: '#fff',
  showDialog: btn => {
    const swalOpts = {
      title: btn.options.title,
      input: 'textarea',
      inputPlaceholder: btn.options.placeholder,
      showCancelButton: true,
    };
    // Allow passing any valid sweetalert2 options
    Object.keys(btn.options).forEach(each => {
      if (each !== 'text' && swal.isValidParameter(each)) {
        swalOpts[each] = btn.options[each];
      }
    });
    return btn.alert(swalOpts);
  },
  getPayload: (btn, {value: body}) => {
    const payload = {body};
    if (btn.options.extra) {
      payload.extra = btn.options.extra;
    }
    return payload;
  },
  beforeSend: btn => {
    // Show thank you message before request is sent so the
    // user doesn't have to wait
    return btn.alert('Thank you!', 'Your feedback has been submitted.', 'success');
  },
  sendRequest: (btn, result) => {
    const payload = btn.options.getPayload(btn, result);
    if (payload.body) { // microfeedback backends requires 'body'
      btn.options.beforeSend(btn, result);
      if (btn.options.url) {
        return sendJSON({
          method: 'POST',
          payload,
          url: btn.options.url,
        });
      }
      console.debug('microfeedback payload:');
      console.debug(payload);
      return Promise.resolve(payload);
    }
  },
};
class MicroFeedbackButton {
  constructor(element, options) {
    const opts = element instanceof HTMLElement ? options : element;
    this.options = Object.assign({}, defaults, opts);
    if (!this.options.url) {
      console.warn(
        'options.url not provided. Feedback will only be logged to the console.'
      );
    }
    this.screenshot = null;
    const newID = globalID++;

    if (element instanceof HTMLElement) {
      this.$button = element;
    } else {
      // assume element is an object
      const buttonParent = d.createElement('div');
      buttonParent.id = `__microfeedback-button-${newID}`;
      buttonParent.innerHTML = makeButton(this.options);
      d.body.appendChild(buttonParent);
      this.$button = buttonParent.querySelector('.microfeedback-button');
    }
    this.$button.addEventListener('click', this.onClick.bind(this), false);
  }
  alert(...args) {
    return swal(...args);
  }
  send(value) {
    return this.options.sendRequest(this, value);
  }
  onSubmit(value) {
    if (!value.dismiss) {
      return this.send(value);
    }
  }
  onClick(e) {
    e && e.preventDefault();
    return this.options.showDialog(this)
      .then(this.onSubmit.bind(this));
  }
  sendRequest(payload) {
    return sendJSON({
      method: 'POST',
      url: this.options.url,
      payload,
    });
  }
  destroy() {
    this.$button.removeEventListener('click', this.onClick.bind(this));
  }
}

const factory = (element, options) => new MicroFeedbackButton(element, options);
factory.MicroFeedbackButton = MicroFeedbackButton;
export default factory;
