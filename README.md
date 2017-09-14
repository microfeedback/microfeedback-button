# microfeedback-button

[![Build Status](https://travis-ci.org/microfeedback/microfeedback-button.svg?branch=master)](https://travis-ci.org/microfeedback/microfeedback-button)

A simple widget for capturing user feedback. Use together with a microfeedback backend such as [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

* ~3 KB gzipped
* No dependencies
* No boilerplate

## Quickstart

First, deploy a microfeedback backend, e.g. [microfeedback-github](https://github.com/microfeedback/microfeedback-github).

Add the following to your site, using your backend's URL.

```html
<script src="https://unpkg.com/microfeedback-button/dist/microfeedback-button.min.js"></script>
<script>
microfeedback({url: 'http://your-backend-url.now.sh/'});
</script>
```

## Usage as a package

microfeedback-button can also be installed and used as a package.

```
npm install microfeedback-button --save
```

```javascript
const microfeedback = require('microfeedback-button');
microfeedback({url: 'your-microservice-url'});
```

## Developing

* `npm install` or `yarn install`
* To run tests: `npm test`
* To run the example: `npm run dev`

## License

MIT Licensed.
