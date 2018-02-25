const defaults = {
  method: 'POST',
  url: null,
  payload: null,
};

export default options => {
  const opts = Object.assign({}, defaults, options);
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open(opts.method, opts.url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    req.send(JSON.stringify(opts.payload));
    req.addEventListener('load', () => {
      if (req.status < 400) {
        const data = JSON.parse(req.response);
        resolve(data);
      } else {
        reject(new Error(req.statusText));
      }
    });
    req.addEventListener('error', () => {
      reject(new Error('Network Error'));
    });
  });
};
