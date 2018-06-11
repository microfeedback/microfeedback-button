const browserEnv = require('browser-env');

browserEnv();
// Prevents an error when loading sweetalert2's weakmap polyfill
window.WeakMap = () => {};
// Prevents warnings from being logged in tests
window.scrollTo = () => {};
