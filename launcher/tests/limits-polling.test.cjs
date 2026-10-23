const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

for (const active of [false, true]) test(`Limits suspends hidden reads, resumes once, and polls ${active ? 'the open page' : 'the cached sidebar'} without overlap`, async () => {
  const effects = [];
  const timers = new Map();
  const document = new EventTarget();
  document.hidden = true;
  let timerId = 0;
  let lastDelay;
  const sandbox = {
    exports: {}, document,
    require: name => {
      assert.equal(name, 'react');
      return {
        useEffect: effect => effects.push(effect),
        useState: value => [value, () => {}],
        useRef: value => ({current:value}),
      };
    },
    setTimeout: (callback, delay) => { lastDelay = delay; timers.set(++timerId, callback); return timerId; },
    clearTimeout: id => timers.delete(id),
  };
  const source = fs.readFileSync(path.join(__dirname, '../src/useLimits.ts'), 'utf8');
  vm.runInNewContext(ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  }}).outputText, sandbox);
  let reads = 0;
  let finish;
  sandbox.exports.useLimits({getLimits: () => {
    reads += 1;
    return new Promise(resolve => { finish = resolve; });
  }}, false, active);
  const cleanups = effects.map(effect=>effect());
  const visibility = hidden => {
    document.hidden = hidden;
    document.dispatchEvent(new Event('visibilitychange'));
  };
  assert.equal(reads, 0);
  assert.equal(timers.size, 0);
  visibility(false);
  visibility(false);
  assert.equal(reads, 1);
  finish({enabled:false});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(timers.size, 1);
  assert.equal(lastDelay, active ? 10_000 : 60_000);
  visibility(true);
  assert.equal(timers.size, 0);
  visibility(false);
  assert.equal(reads, 2);
  for (const cleanup of cleanups) cleanup();
  finish({enabled:false});
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(timers.size, 0);
  visibility(false);
  assert.equal(reads, 2);
});
