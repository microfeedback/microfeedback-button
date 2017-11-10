# microfeedback-button

[![Current Version](https://img.shields.io/npm/v/microfeedback-button.svg)](https://www.npmjs.org/package/microfeedback-button)
[![Build Status](https://travis-ci.org/microfeedback/microfeedback-button.svg?branch=master)](https://travis-ci.org/microfeedback/microfeedback-button)
[![Greenkeeper badge](https://badges.greenkeeper.io/microfeedback/microfeedback-button.svg)](https://greenkeeper.io/)

A simple widget for capturing user feedback. Use together with a microfeedback backend such as [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

* ~3 KB gzipped
* No dependencies
* No boilerplate
* Optional screenshot support (beta); requires [html2canvas](https://github.com/niklasvh/html2canvas)

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
  onSubmit: function() {
    alert('Thank you for your feedback!');
  }
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
  onSubmit: function() {
    alert('Thank you for your feedback!');
  }
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

.microfeedback-dialog {
  font-family: 'Georgia' serif;
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
  - `title`: Text to display in the . Default: `'Feedback'`
  - `placeholder`: Placeholder text in the dialog input. Default: `'Describe your issue or share your ideas'`
  - `rows`: Number of rows in the dialog input. Default: `5`
  - `onSubmit`: Function to execute when feedback is submitted.
  Default: `noop`
  - `onValidationError`: Function to execute when invalid feedback is submitted.
  Default: `noop`
  - `maxLength`: Maximum allowed length of the input. Default: 500
  - `screenshot`: If an `HTMLElement`, enable screenshots to be
  attached. The element will be captured using html2canvas. Default:
  `false`
  - `errorColor`: Color to use to highlight the input when a validation
  error occurs. Default: `'rgba(204, 51, 99, 0.5)'`
  - `backgroundColor`: Background color for the default button and the
  submit button. Default: `'rgba(61, 194, 85, 0.8)'`
  - `color`: Color for the default button text. Default: `'#fff'`
  - `help`: Help text to display in the dialog. *WARNING:* This gets
  rendered as HTML, so don't include any user input. Default: `null`
  - `append`: If `true`, append the dialog as HTML, even if it has
  already been appended. This is only useful if you intend to have
  multiple feedback buttons on the same page with different options.


## Developing

* `npm install`
* To run tests: `npm test`
* To run the example: `npm run dev`

## License

MIT Licensed.
