import sinon from 'sinon';
import test from 'ava';
import syn from 'syn';
import {MicroFeedbackButton} from '../dist/microfeedback-button';

const $ = document.querySelector.bind(document);

test('renders button', t => {
  const btn = new MicroFeedbackButton({url: false});
  t.truthy($('.microfeedback-button'));
  btn.destroy();
});

test.cb('clicking button shows dialog', t => {
  const btn = new MicroFeedbackButton({url: false});
  syn.click(btn.$button, () => {
    const popup = $('.swal2-popup');
    t.truthy(popup);
    btn.destroy();
    t.end();
  });
});

test.cb('can type in dialog and submit', t => {
  const spy = sinon.spy();
  const btn = new MicroFeedbackButton({url: false, animation: false, beforeSend: spy});
  syn.click(btn.$button).delay(() => {
    const input = $('.swal2-textarea');
    syn.type(input, 'bar baz', () => {
      const submit = $('button.swal2-confirm');
      syn.click(submit).delay(() => {
        t.truthy(spy.called);
        t.deepEqual(spy.args[0][1], {value: 'bar baz'});
        btn.destroy();
        t.end();
      });
    }, 200);
  }, 200);
});

test.cb('sends request to URL', t => {
  const server = sinon.fakeServer.create();
  const url = 'http://test.test/';
  const btn = new MicroFeedbackButton({url});
  const response = {
    backend: {name: 'github', version: '1.2.3'},
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    {'Content-Type': 'application/json'},
    JSON.stringify(response),
  ]);
  syn.click(btn.$button, () => {
    const input = $('.swal2-textarea');
    syn.type(input, 'foo bar baz', () => {
      const submit = $('button.swal2-confirm');
      syn.click(submit).delay(() => {
        server.respond();
        t.is(server.requests.length, 1);
        btn.destroy();
        t.end();
      });
    });
  });
});

test.cb('sends request to URL returned by function', t => {
  const server = sinon.fakeServer.create();
  const url = 'http://foo.test';
  const btn = new MicroFeedbackButton({
    url(btn, {value}) {
      t.true(value.includes('oo'));
      return url;
    },
  });
  const response = {
    backend: {name: 'github', version: '1.2.3'},
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    {'Content-Type': 'application/json'},
    JSON.stringify(response),
  ]);
  syn.click(btn.$button, () => {
    const input = $('.swal2-textarea');
    syn.type(input, 'fool', () => {
      const submit = $('button.swal2-confirm');
      syn.click(submit).delay(() => {
        server.respond();
        t.is(server.requests.length, 1);
        t.is(server.requests[0].url, url);
        btn.destroy();
        t.end();
      });
    });
  });
});

test.cb('sends extra information in request', t => {
  const server = sinon.fakeServer.create();
  const url = 'http://test.test/';
  const btn = new MicroFeedbackButton({url, extra: {foo: 42}});
  const response = {
    backend: {name: 'github', version: '1.2.3'},
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    {'Content-Type': 'application/json'},
    JSON.stringify(response),
  ]);

  syn.click(btn.$button, () => {
    const input = $('.swal2-textarea');
    syn.type(input, 'foo bar baz', () => {
      const submit = $('button.swal2-confirm');
      syn.click(submit).delay(() => {
        server.respond();
        t.is(server.requests.length, 1);
        const reqBody = JSON.parse(server.requests[0].requestBody);
        t.deepEqual(reqBody.extra, {foo: 42});
        btn.destroy();
        t.end();
      });
    });
  });
});
