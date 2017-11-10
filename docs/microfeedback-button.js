(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.microfeedback = factory());
}(this, (function () { 'use strict';

function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

__$styleInject(".microfeedback-button {\n  text-decoration:none;\n  position:fixed;\n  bottom:0;\n  right:50px;\n  padding:4px 7px;\n  font-size:12px;\n  border-top-left-radius:5px;\n  border-top-right-radius:5px;\n  z-index: 1001;\n}\n\n.microfeedback-dialog {\n  position:fixed;\n  top:20%;\n  left:25%;\n  right:25%;\n  background: rgba(255,255,255,1.0);\n  -webkit-box-shadow:0 0 25px #aaa;\n          box-shadow:0 0 25px #aaa;\n  padding:20px;\n  z-index: 999999999;\n}\n\n.microfeedback-dialog .microfeedback-dialog-title {\n  text-align: left;\n  font-size: 24px;\n  margin: 0;\n  padding-bottom: 10px;\n}\n\n.microfeedback-dialog a {\n  text-decoration: none;\n}\n\n.microfeedback-text {\n  padding: .3em 0 .3em .2em;\n  text-align: left;\n  width: 99%;\n  font-size: 100%;\n  resize: vertical;\n  margin-bottom: 10px;\n}\n\n.microfeedback-form-button {\n  cursor: pointer;\n  float: right;\n  margin-left: 10px;\n}\n\n.microfeedback-button:hover{\n  opacity: .7;\n}\n\n.microfeedback-dialog button {\n    font-family: inherit;\n    font-size: 100%;\n    padding: .5em 1em;\n    border: 1px solid #999;\n    border: transparent;\n    background-color: #E6E6E6;\n    text-decoration: none;\n    border-radius: 2px;\n    display: inline-block;\n    white-space: nowrap;\n    vertical-align: middle;\n    text-align: center;\n    cursor: pointer;\n    -webkit-user-select: none;\n       -moz-user-select: none;\n        -ms-user-select: none;\n            user-select: none;\n    -webkit-box-sizing: border-box;\n            box-sizing: border-box;\n    line-height: normal;\n    overflow: visible;\n}\n\n.microfeedback-dialog button:hover{\n  opacity: .7;\n}\n\n.microfeedback-dialog-close {\n  position:fixed;\n  top:19%;\n  right:25%;\n  padding:10px;\n  font-size:24px;\n  color:rgba(0,0,0,.3);\n  line-height:1;\n}\n\n@media only screen and (max-width:800px){\n  .microfeedback-dialog {\n    left:10%;\n    width:80%\n  }\n  .microfeedback-dialog-close {\n    right:10%\n  }\n}\n", undefined);

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var noop$1 = function noop() {};

var defaults$1 = {
  method: 'POST',
  url: null,
  payload: null,
  headers: {},
  prepare: noop$1
};

var sendJSON = (function (options) {
  var opts = _extends({}, defaults$1, options);
  return new Promise(function (resolve, reject) {
    var req = new XMLHttpRequest();
    req.open(opts.method, opts.url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    opts.prepare(req);
    req.send(JSON.stringify(opts.payload));
    req.onload = function () {
      if (req.status < 400) {
        var data = JSON.parse(req.response);
        resolve(data);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = function () {
      reject(new Error('Network Error'));
    };
  });
});

/**
 * Small wrapper around html2canvas for taking a screenshot and uploading the image
 * to imgur.
 *
 * Usage:
 *
 *  takeScreenshot().then((capture) => {
 *    capture.upload().then((url) => {
 *      console.log(url);
 *    });
 *    capture.dataURL => String
 *    capture.thumbnail() => Image
 *  });
 */
// html2canvas is an optional dependency
var _window = window;
var html2canvas = _window.html2canvas;


var imgurClientID = 'cc9df57988494ca';
var uploadURL = 'https://api.imgur.com/3/upload';

var Capture = function () {
  function Capture(canvas) {
    classCallCheck(this, Capture);

    this.dataURL = canvas.toDataURL();
    this.imageData = this.dataURL.replace(/data:image\/png;base64/, '');
  }

  createClass(Capture, [{
    key: 'thumbnail',
    value: function thumbnail() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$width = _ref.width,
          width = _ref$width === undefined ? 300 : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === undefined ? null : _ref$height;

      var img = new Image();
      if (width) img.style.width = width + 'px';
      if (height) img.style.height = height + 'px';
      img.src = this.dataURL;
      return img;
    }
  }, {
    key: 'upload',
    value: function upload() {
      var _this = this;

      // prettier-ignore
      if (!this.imageData) throw new Error('Must call takeScreenshot before uploading');
      return new Promise(function (resolve, reject) {
        sendJSON({
          method: 'POST',
          url: uploadURL,
          prepare: function prepare(xhr) {
            xhr.setRequestHeader('Authorization', 'Client-ID ' + imgurClientID);
          },
          payload: {
            type: 'base64',
            image: _this.imageData
          }
        }).then(function (resp) {
          return resolve(resp.data.link);
        }, reject);
      });
    }
  }]);
  return Capture;
}();

var takeScreenshot = (function (elm) {
  return new Promise(function (resolve, reject) {
    var node = elm instanceof HTMLElement ? elm : document.body;
    if (html2canvas) {
      html2canvas(node).then(function (canvas) {
        resolve(new Capture(canvas));
      }, reject);
    } else {
      throw new Error('html2canvas required for screenshot capability');
    }
  });
});

var hasHTML2Canvas = window.html2canvas;
// Less typing
var d = document;

var globalID = 0; // used to create unique CSS IDs for inserted elements

var Button = function Button(options) {
  return '<a style="background-color: ' + options.backgroundColor + '; color: ' + options.color + ';"\n  class="microfeedback-button" href="#">' + options.text + '</a>';
};

var Dialog = function Dialog(options) {
  return '\n  <div style="display: none;" class="microfeedback-dialog">\n    <form class="microfeedback-form" action="n">\n    <h5 class="microfeedback-dialog-title">' + options.title + '</h5>\n    <a class="microfeedback-dialog-close" href="#">&times;</a>\n    <textarea class="microfeedback-text" rows="' + options.rows + '"\n           placeholder="' + options.placeholder + '" maxlength="' + options.maxLength + '"></textarea>\n    <div class="microfeedback-screenshot" style="display: ' + (options.screenshot ? '' : 'none') + '">\n      <input class="microfeedback-screenshot-checkbox" type="checkbox" /> <span>Include screenshot</span>\n      <div class="microfeedback-screenshot-preview"></div>\n    </div>\n    <div class="microfeedback-help" style="display: ' + (options.help ? '' : 'none') + '">\n      ' + options.help + '\n    </div>\n    <div class="microfeedback-dialog-buttons">\n      <button style="background-color: ' + options.backgroundColor + '; color: ' + options.color + ';"\n        class="microfeedback-form-button microfeedback-button-submit" type="submit">' + options.send + '</button>\n      <button class="microfeedback-form-button microfeedback-button-cancel" type="button">Cancel</button>\n    </div>\n    </form>\n  </div>\n';
};

var noop = function noop() {};

var defaults = {
  url: null,
  text: 'Feedback',
  title: 'Send feedback',
  placeholder: 'Describe your issue or share your ideas',
  send: 'Send',
  maxLength: 500,
  rows: 5,
  onSubmit: noop,
  onValidationError: noop,
  extra: null,
  screenshot: false,
  append: false,
  errorColor: 'rgba(204, 51, 99, 0.5)',
  backgroundColor: 'rgba(61, 194, 85, 0.8)',
  color: '#fff',
  help: null
};

var MicroFeedbackButton = function () {
  function MicroFeedbackButton(element, options) {
    classCallCheck(this, MicroFeedbackButton);

    var opts = element instanceof HTMLElement ? options : element;
    this.options = _extends({}, defaults, opts);
    // Either null or a promise to a Capture (if "Include Screenshot" is checked)
    if (this.options.screenshot && !hasHTML2Canvas) {
      throw new Error('html2canvas required for screenshot capability');
    }
    this.screenshot = null;
    this.listeners = [];
    var newID = globalID++;

    // Ensure that the dialog HTML is inserted only once
    var dialogID = this.options.append ? '__microfeedback-dialog-' + newID : '__microfeedback-dialog';
    this.dialogParent = d.getElementById(dialogID);
    var dialogCreated = false;
    if (!this.dialogParent || this.options.append) {
      dialogCreated = true;
      this.dialogParent = d.createElement('div');
      this.dialogParent.id = dialogID;
      this.dialogParent.innerHTML = Dialog(this.options);
      d.body.appendChild(this.dialogParent);
    }

    if (element instanceof HTMLElement) {
      this.$button = element;
    } else {
      // assume element is an object
      var buttonParent = d.createElement('div');
      buttonParent.id = '__microfeedback-button-' + newID;
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

  createClass(MicroFeedbackButton, [{
    key: 'addListener',
    value: function addListener(elm, event, handler) {
      elm.addEventListener(event, handler, false);
      this.listeners.push([elm, event, handler]);
    }
  }, {
    key: 'showDialog',
    value: function showDialog() {
      this.$dialog.style.display = '';
      this.$input.focus();
    }
  }, {
    key: 'hideDialog',
    value: function hideDialog() {
      this.$dialog.style.display = 'none';
    }
  }, {
    key: 'onChangeScreenshot',
    value: function onChangeScreenshot(e) {
      var _this = this;

      if (e.target.checked) {
        this.screenshot = takeScreenshot(this.options.screenshot).then(function (capture) {
          _this.$screenshotPreview.appendChild(capture.thumbnail());
          return capture;
        });
      } else {
        this.screenshot = null;
        this.$screenshotPreview.innerHTML = '';
      }
    }
  }, {
    key: 'onClick',
    value: function onClick(e) {
      e && e.preventDefault();
      this.showDialog();
    }
  }, {
    key: 'onDismiss',
    value: function onDismiss(e) {
      e && e.preventDefault();
      this.hideDialog();
      this.$input.value = '';
      this.$screenshot.checked = false;
      this.$screenshotPreview.innerHTML = '';
      this.screenshot = null;
      this.$input.style.border = '';
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(payload) {
      return sendJSON({
        method: 'POST',
        url: this.options.url,
        payload: payload
      });
    }
  }, {
    key: 'submit',
    value: function submit(body) {
      var _this2 = this;

      var payload = { body: body };
      if (this.options.extra) {
        payload.extra = this.options.extra;
      }
      return new Promise(function (resolve, reject) {
        if (_this2.options.screenshot && _this2.screenshot) {
          _this2.screenshot.then(function (capture) {
            if (capture) {
              capture.upload().then(function (imageURL) {
                payload.screenshotURL = imageURL;
                _this2.sendRequest(payload).then(resolve, reject);
              });
            } else {
              _this2.sendRequest(payload).then(resolve, reject);
            }
          }, reject);
        } else {
          _this2.sendRequest(payload).then(resolve, reject);
        }
      });
    }
  }, {
    key: 'onValidationFail',
    value: function onValidationFail() {
      this.$input.style.border = '2px solid ' + this.options.errorColor;
      this.$input.focus();
      this.options.onValidationError();
    }
  }, {
    key: 'onSubmit',
    value: function onSubmit(e) {
      e && e.preventDefault();
      var value = this.$input.value;

      if (value.length < 1 || value.length > this.options.maxLength) {
        this.onValidationFail(value);
        return false;
      }
      if (this.options.url !== false) {
        this.submit(value).then(function (res) {// eslint-disable-line
          // TODO: Show a proper dialog after feedback is submitted
          // if (res.backend.name === 'github') {
          //   alert(`Posted a new issue at: ${res.result.html_url}`);
          // } else {
          //   alert('Thank you for your feedback!');
          // }
        });
      } else {
        console.log('Feedback submitted: ' + value); // eslint-disable-line
      }
      this.onDismiss();
      this.options.onSubmit(e, value);
      return true;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.dialogParent && d.body.removeChild(this.dialogParent);
      this.listeners.forEach(function (each) {
        each[0].removeEventListener(each[1], each[2], false);
      });
    }
  }]);
  return MicroFeedbackButton;
}();

var factory = function factory(element, options) {
  return new MicroFeedbackButton(element, options);
};
factory.MicroFeedbackButton = MicroFeedbackButton;
factory.takeScreenshot = takeScreenshot;

return factory;

})));
