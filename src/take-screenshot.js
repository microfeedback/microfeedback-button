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
import sendJSON from './send-json';

// html2canvas is an optional dependency
const { html2canvas } = window;

const imgurClientID = 'cc9df57988494ca';
const uploadURL = 'https://api.imgur.com/3/upload';

class Capture {
  constructor(canvas) {
    this.dataURL = canvas.toDataURL();
    this.imageData = this.dataURL.replace(/data:image\/png;base64/, '');
  }
  thumbnail({ width = 300, height = null } = {}) {
    const img = new Image();
    if (width) img.style.width = `${width}px`;
    if (height) img.style.height = `${height}px`;
    img.src = this.dataURL;
    return img;
  }
  upload() {
    // prettier-ignore
    if (!this.imageData) throw new Error('Must call takeScreenshot before uploading');
    return new Promise((resolve, reject) => {
      sendJSON({
        method: 'POST',
        url: uploadURL,
        prepare: xhr => {
          xhr.setRequestHeader('Authorization', `Client-ID ${imgurClientID}`);
        },
        payload: {
          type: 'base64',
          image: this.imageData,
        },
      }).then(resp => resolve(resp.data.link), reject);
    });
  }
}

export default elm => new Promise((resolve, reject) => {
  const node = elm instanceof HTMLElement ? elm : document.body;
  if (html2canvas) {
    html2canvas(node).then(canvas => {
      resolve(new Capture(canvas));
    }, reject);
  } else {
    throw new Error('html2canvas required for screenshot capability');
  }
});
