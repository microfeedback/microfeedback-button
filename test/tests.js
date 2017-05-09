import sinon from 'sinon';
import test from 'ava';
import syn from 'syn';
import { WishesButton } from '../dist/wishes-button.js';

const $ = document.querySelector.bind(document);

test('renders button', t => {
  const btn = new WishesButton({ url: false });
  t.truthy($('#wishes-button'));
  btn.destroy();
});

test.cb('clicking button shows dialog', t => {
  const btn = new WishesButton({ url: false });
  syn.click($('#wishes-button'), () => {
    t.truthy($('#wishes-dialog'));
    btn.destroy();
    t.end();
  });
});

test.cb('can type in dialog and submit', t => {
  const spy = sinon.spy();
  const btn = new WishesButton({ url: false, onSubmit: spy });
  syn.click($('#wishes-button'), () => {
    syn.type($('#wishes-text'), 'foo bar baz', () => {
      syn.click($('#wishes-submit'), () => {
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
  const btn = new WishesButton({ url });
  const response = {
    backend: { name: 'github', version: '1.2.3' },
    result: {},
  };
  server.respondWith('POST', url, [
    201,
    { 'Content-Type': 'application/json' },
    JSON.stringify(response),
  ]);
  syn.click($('#wishes-button'), () => {
    syn.type($('#wishes-text'), 'foo bar baz', () => {
      syn.click($('#wishes-submit'), () => {
        server.respond();
        t.is(server.requests.length, 1);
        btn.destroy();
        t.end();
      });
    });
  });
});
