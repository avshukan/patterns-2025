'use strict';

const assert = require('assert');

const PurchaseIterator = require('./purchase-iterator');

async function runTests() {
  {
    const input = [
      { name: 'P1', price: 1 },
      { name: 'P2', price: 2 },
      { name: 'P3', price: 3 },
    ];

    const iter = PurchaseIterator.create(input);

    const output = [];

    for await (const item of iter) {
      output.push(item);
    }

    assert.deepStrictEqual(output, input, 'iterator order');
  }

  {
    assert.throws(
      () => PurchaseIterator.create(null),
      {
        name: 'Error',
        message: 'Purchases must be an array',
      },
      'should throw on non-array',
    );
  }

  console.log('PurchaseIterator tests passed');
}

runTests()
  .then(() => console.log('\nAll tests passed!'))
  .catch((err) => {
    console.error('\nTest failed:');
    console.error(err);
    process.exit(1);
  });
