# microfeedback-button

[![Current Version](https://img.shields.io/npm/v/microfeedback-button.svg)](https://www.npmjs.org/package/microfeedback-button)
[![Build Status](https://travis-ci.org/microfeedback/microfeedback-button.svg?branch=master)](https://travis-ci.org/microfeedback/microfeedback-button)
[![Greenkeeper badge](https://badges.greenkeeper.io/microfeedback/microfeedback-button.svg)](https://greenkeeper.io/)

A simple widget for capturing user feedback. Use together with a microfeedback backend such as [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

Uses [sweetalert2](https://sweetalert2.github.io/) under the hood to
display responsive, customizable, and accessible input dialogs.

## Demo

https://microfeedback.github.io/microfeedback-button/

## Documentation

https://microfeedback.js.org/ui-components/microfeedback-button/

## API

### `microfeedback([elem], [options])`

- `elem`: The `HTMLElement` to bind to. If not given, the default button
will be rendered.
- `options`
  - `url`: URL for your microfeedback backend. If `null`,
  feedback will be logged to the console. May also be a function that
  receives `btn` and `result` (the user input) as arguments and returns a URL. Default: `null`
  - `text`: Text to display in the default button. Default: `'Feedback'`
  - `title`: Title to display in the dialog. Default: `'Send feedback'`
  - `ariaLabel`: `aria-label` for the default button.
  - `placeholder`: Placeholder text in the dialog input. Default: `'Describe your issue or share your ideas'`
  - `backgroundColor`: Background color for the default button. Default: `'#3085d6'`
  - `color`: Color for the default button text. Default: `'#fff'`
  - `animation`: Enable animations. Default: `true`
  - `showDialog`: Function that displays a sweetalert2 dialog. Returns a
  `Promise` that resolves to the input result. Use `return btn.alert(...)` to
  display the dialog.
  - `getPayload`: Function that receives `btn` (the
      `MicroFeedbackButton` instance) and input result and returns
      the request payload to send to the microfeedback backend.
  - `beforeSend`: Function that receives `btn` (the
      `MicroFeedbackButton` instance) and input result. This is called
      before sending the request to the microfeedback backend. Useful for
      displaying a "Thank you" message with `return btn.alert(...)`.

Additionally, any valid [sweetalert2](https://sweetalert2.github.io/#configuration) option may be
passed to configure the input dialog.


### Methods

#### `btn.alert(...args)`

Display a sweetalert2 dialog. This is equivalent to the `swal` function
from sweetalert2.

## Developing

* `npm install`
* To run tests: `npm test`
* To run tests in watch mode: `npm test -- --watch`
* To run the example: `npm run dev`

## License

MIT Licensed.
