# microfeedback-button

[![Current Version](https://img.shields.io/npm/v/microfeedback-button.svg)](https://www.npmjs.org/package/microfeedback-button)
[![Build Status](https://travis-ci.org/microfeedback/microfeedback-button.svg?branch=master)](https://travis-ci.org/microfeedback/microfeedback-button)
[![Greenkeeper badge](https://badges.greenkeeper.io/microfeedback/microfeedback-button.svg)](https://greenkeeper.io/)

A simple widget for capturing user feedback. Use together with a microfeedback backend such as [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

## Demo

https://microfeedback.github.io/microfeedback-button/

## Quickstart

First, deploy a microfeedback backend, e.g. [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

Add the following to your site, using your backend's URL.

```html
<script src="https://unpkg.com/microfeedback-button/dist/microfeedback-button.min.js"></script>
<script>
microfeedback({
  url: 'http://your-backend-url.now.sh/'
});
</script>
```

## Usage as a package

microfeedback-button can also be installed and used as a package.

```
npm install microfeedback-button --save
```

```javascript
const microfeedback = require('microfeedback-button');

microfeedback({
  url: 'your-microservice-url',
});
```

## Styling

Change the color of the button and button text:

```javascript
microfeedback({
  backgroundColor:'#424b54', // Button color
  color: '#fff',  // Button text color
});
```

You can also style the button and dialog in CSS

```css
.microfeedback-button {
  font-family: 'Helvetica Neue' sans-serif;
}
```

## API

### `microfeedback([elem], [options])`

- `elem`: The `HTMLElement` to bind to. If not given, the default button
will be rendered.
- `options`
  - `url`: URL for your microfeedback backend. If `null`,
  feedback will be logged to the console. Default: `null`
  - `text`: Text to display in the default button. Default: `'Feedback'`
  - `title`: Title to display in the dialog. Default: `'Send feedback'`
  - `ariaLabel`: `aria-label` for the default button.
  - `placeholder`: Placeholder text in the dialog input. Default: `'Describe your issue or share your ideas'`
  - `confirmButtonText`: Confirm button text. Default: `'Send'`
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
