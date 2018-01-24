const browserEnv = require('browser-env');

browserEnv();
// Prevents warnings from being logged in tests
window.scrollTo = () => {};
