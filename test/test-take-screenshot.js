import test from 'ava';
import {takeScreenshot} from '../dist/microfeedback-button';

test('returns a promise', t => {
  const promise = takeScreenshot();
  t.truthy(promise.then);
});

test('has dataURL', async t => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const capture = await takeScreenshot(div);
  t.truthy(capture.dataURL);
  t.is(typeof capture.dataURL, 'string');
});

test('has imageData', async t => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const capture = await takeScreenshot(div);
  t.truthy(capture.imageData);
  t.notRegex(capture.imageData, /data:image/);
  t.is(typeof capture.dataURL, 'string');
});
