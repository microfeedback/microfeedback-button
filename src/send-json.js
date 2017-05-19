const noop = () => {};

const defaults = {
  method: 'POST',
  url: null,
  payload: null,
  headers: {},
  prepare: noop,
};

export default (options) => {
  const opts = Object.assign({}, defaults, options);
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(opts.method, opts.url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    opts.prepare(req);
    req.send(JSON.stringify(opts.payload));
    req.onload = () => {
      if (req.status < 400) {
        const data = JSON.parse(req.response);
        resolve(data);
      } else {
        reject(new Error(req.statusText));
      }
    };
    req.onerror = () => {
      reject(new Error('Network Error'));
    };
  });
};
