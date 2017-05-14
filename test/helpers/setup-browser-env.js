const browserEnv = require('browser-env');

browserEnv();
// Set up a mocked html2canvas
const mockCanvas = {
  toDataURL() {
    return 'data:image/png;base64,abc123';
  },
};
window.html2canvas = () => Promise.resolve(mockCanvas);
