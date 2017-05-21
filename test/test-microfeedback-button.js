import sinon from 'sinon';
import test from 'ava';
import syn from 'syn';
import { MicroFeedbackButton } from '../dist/microfeedback-button.js';

const $ = document.querySelector.bind(document);

test('renders button', t => {
  const btn = new MicroFeedbackButton({ url: false });
  t.truthy($('.feedback-button'));
  btn.destroy();
});

test.cb('clicking button shows dialog', t => {
  const btn = new MicroFeedbackButton({ url: false });
  syn.click(btn.$button, () => {
    t.truthy($('.microfeedback-dialog'));
    btn.destroy();
    t.end();
  });
});

test.cb('can type in dialog and submit', t => {
  const spy = sinon.spy();
  const btn = new MicroFeedbackButton({ url: false, onSubmit: spy });
  syn.click(btn.$button, () => {
    syn.type(btn.$input, 'foo bar baz', () => {
      syn.click(btn.$submit, () => {
        t.truthy(spy.called);
        t.is(spy.args[0][1], 'foo bar baz');
        btn.destroy();
        t.end();
      });
    });
  });
});

test.cb('sends request to URL', t => {
  const server = sinon.fakeServer.create();
  const url = 'http://test.test/';
  const btn = new MicroFeedbackButton({ url });
  const response = {
    backend: { name: 'github', version: '1.2.3' },
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    { 'Content-Type': 'application/json' },
    JSON.stringify(response),
  ]);
  syn.click(btn.$button, () => {
    syn.type(btn.$input, 'foo bar baz', () => {
      syn.click(btn.$submit, () => {
        server.respond();
        t.is(server.requests.length, 1);
        btn.destroy();
        t.end();
      });
    });
  });
});


test.cb('sends extra information in request', t => {
  const server = sinon.fakeServer.create();
  const url = 'http://test.test/';
  const btn = new MicroFeedbackButton({ url, extra: { foo: 42 } });
  const response = {
    backend: { name: 'github', version: '1.2.3' },
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    { 'Content-Type': 'application/json' },
    JSON.stringify(response),
  ]);
  syn.click(btn.$button, () => {
    syn.type(btn.$input, 'foo bar baz', () => {
      syn.click(btn.$submit, () => {
        server.respond();
        t.is(server.requests.length, 1);
        const reqBody = JSON.parse(server.requests[0].requestBody);
        t.deepEqual(reqBody.extra, { foo: 42 });
        btn.destroy();
        t.end();
      });
    });
  });
});
