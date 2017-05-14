const noop = () => {};

const defaults = {
  method: 'POST',
  url: null,
  payload: null,
  headers: {},
  prepare: noop,
  success: noop,
  error: noop,
};

export default (options) => {
  const opts = Object.assign({}, defaults, options);
  const req = new XMLHttpRequest();
  req.open(opts.method, opts.url, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.setRequestHeader('Accept', 'application/json');
  opts.prepare(req);
  req.send(JSON.stringify(opts.payload));
  req.onload = () => {
    const data = JSON.parse(req.response);
    opts.success(data, req);
  };
  req.onerror = opts.error;
};
