'use strict';

const assert = require('assert');

const { main } = require('./main');

const purchase = require('../fixture.json');

const expected = '';

(async () => {
  const result = await main(purchase);

  assert.strictEqual(
    result,
    expected,
    `Expected ${expected} but got ${result}`,
  );

  console.log('Test passed');
})();
