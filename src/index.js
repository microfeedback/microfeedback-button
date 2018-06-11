import swal from 'sweetalert2';
import './microfeedback-button.css';
import sendJSON from './send-json';

// Less typing
const d = document;
const noop = () => {};
const clickedClass = 'microfeedback-button--clicked';

const makeButton = options =>
  `<button aria-label="${options.buttonAriaLabel}" style="background-color: ${
    options.backgroundColor
  }; color: ${options.color}" class="microfeedback-button">${
    options.buttonText
  }</button>`;
const defaults = {
  url: null,
  buttonText: 'Feedback',
  buttonAriaLabel: 'Send feedback',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  extra: null,
  backgroundColor: '#3085d6',
  color: '#fff',
  optimistic: true,
  showDialog: btn => {
    const swalOpts = {
      title: btn.options.title,
      input: 'textarea',
      inputPlaceholder: btn.options.placeholder,
      showCancelButton: true,
      confirmButtonText: 'Send',
    };
    if (!btn.options.optimistic) {
      swalOpts.showLoaderOnConfirm = true;
      swalOpts.preConfirm = value => btn.onSubmit({value});
      swalOpts.allowOutsideClick = () => !swal.isLoading();
    }
    // Allow passing any valid sweetalert2 options
    Object.keys(btn.options).forEach(each => {
      if (swal.isValidParameter(each)) {
        swalOpts[each] = btn.options[each];
      }
    });
    return btn.alert(swalOpts);
  },
  showSuccessDialog: btn => {
    return btn.alert(
      'Thank you!',
      'Your feedback has been submitted.',
      'success'
    );
  },
  getPayload: (btn, {value: body}) => {
    const payload = {body};
    if (btn.options.extra) {
      payload.extra = btn.options.extra;
    }
    return payload;
  },
  preSend: (btn, input) => {
    if (btn.options.optimistic) {
      // Show thank you message before request is sent so the
      // user doesn't have to wait
      return btn.options.showSuccessDialog(btn, input);
    }
  },
  sendRequest: (btn, url, payload) => {
    return sendJSON({
      url,
      method: 'POST',
      payload,
    });
  },
  onSuccess: (btn, input, response) => {
    if (!btn.options.optimistic) {
      return btn.options.showSuccessDialog(btn, input, response);
    }
  },
  onFailure: noop,
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

    this.appended = false;
    this._parent = null;
    if (element instanceof HTMLElement) {
      this.el = element;
    } else {
      // assume element is an object
      const buttonParent = d.createElement('div');
      buttonParent.innerHTML = makeButton(this.options);
      d.body.appendChild(buttonParent);
      this._parent = buttonParent;
      this.appended = true;
      this.el = buttonParent.querySelector('.microfeedback-button');
    }
    this.el.addEventListener('click', this.onClick.bind(this), false);
  }

  alert(...args) {
    return swal(...args);
  }

  onSubmit(input) {
    // Backend requires body in payload
    if (input.dismiss) {
      return null;
    }
    const payload = this.options.getPayload(this, input);
    // microfeedback backends requires 'body'
    if (payload.body) {
      this.options.preSend(this, input);
      let promise;
      const url =
        typeof this.options.url === 'function'
          ? this.options.url(this, input)
          : this.options.url;
      if (url) {
        promise = this.options.sendRequest(this, url, payload, input);
      } else {
        console.debug('microfeedback payload:');
        console.debug(payload);
        promise = Promise.resolve(payload);
      }
      return promise.then(
        this.options.onSuccess.bind(this, this, input),
        this.options.onFailure.bind(this, this, input)
      );
    }
  }

  onClick(e) {
    // eslint-disable-next-line no-unused-expressions
    e && e.preventDefault();
    this.el.classList.add(clickedClass);
    const promise = this.options.showDialog(this).then(input => {
      this.el.classList.remove(clickedClass);
      return input;
    });
    if (this.options.optimistic) {
      promise.then(this.onSubmit.bind(this));
    }
    return promise;
  }

  destroy() {
    this.el.removeEventListener('click', this.onClick.bind(this));
    if (this.appended) {
      d.body.removeChild(this._parent);
    }
  }
}

const factory = (element, options) => new MicroFeedbackButton(element, options);
factory.MicroFeedbackButton = MicroFeedbackButton;
export default factory;
