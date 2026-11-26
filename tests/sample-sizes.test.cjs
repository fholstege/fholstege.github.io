const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const post = fs.readFileSync(path.join(__dirname, '../_writing/sample-sizes.md'), 'utf8');
const script = post.match(/<script>([\s\S]*?)<\/script>/)[1];
const events = {};
const elements = {
  'sample-size-calculator': { addEventListener: (name, callback) => { events[name] = callback; } },
  'beta-probability': { valueAsNumber: 5, value: '5' },
  'violation-probability': { valueAsNumber: 1, value: '1' },
  'sample-size-result': { textContent: '' }
};
vm.runInNewContext(script, { document: { getElementById: id => elements[id] } });
const output = () => elements['sample-size-result'].textContent;
assert.match(output(), /^299 interactions/);
for (const [mu, expected] of [[10, 29], [5, 59], [1, 299], [0.1, 2995], [0.01, 29956], [0.001, 299572]]) {
  elements['violation-probability'].valueAsNumber = mu;
  elements['violation-probability'].value = String(mu);
  events.input();
  assert.ok(output().startsWith(expected.toLocaleString('en-US') + ' interactions'));
  assert.ok((1 - mu / 100) ** expected <= 0.05);
  assert.ok((1 - mu / 100) ** (expected - 1) > 0.05);
}
for (const id of ['beta-probability', 'violation-probability']) {
  for (const value of [0, 100, -1, 101, NaN, Infinity]) {
    elements[id].valueAsNumber = value;
    events.input();
    assert.match(output(), /strictly between/);
  }
  elements[id].valueAsNumber = 50;
}
events.input();
assert.match(output(), /^1 interaction gives/);
elements['violation-probability'].valueAsNumber = 1e-20;
events.input();
assert.match(output(), /too large/);
console.log('Calculator examples, minimum sample counts, input validation, and numerical limits passed.');
