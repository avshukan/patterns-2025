'use strict';

const assert = require('assert');

const Basket = require('./basket');

async function runTests() {
  {
    const calls = [];

    const basket = new Basket(
      { limit: 100 },
      (items, total, cancelled) => calls.push({ items, total, cancelled }),
    );

    basket.add({ name: 'A', price: 40 });

    basket.add({ name: 'B', price: 70 });

    basket.add({ name: 'C', price: 50 });

    const result = await basket.end();

    assert.strictEqual(result.total, 90, 'total');

    assert.deepStrictEqual(result.items,
      [
        { name: 'A', price: 40 },
        { name: 'C', price: 50 },
      ],
      'items',
    );

    assert.deepStrictEqual(
      result.cancelled,
      [
        { name: 'B', price: 70 },
      ],
      'cancelled',
    );

    // onEnd должен был быть вызван именно с такими же данными
    assert.strictEqual(calls.length, 1, 'onEnd calls');

    assert.deepStrictEqual(calls[0], result, 'onEnd args match result');
  }

  {
    const basket = new Basket({ limit: 200 });
    basket.add({ name: 'X', price: 50 });
    basket.add({ name: 'Y', price: 150 });
    const { items, total, cancelled } = await basket.end();

    assert.strictEqual(total, 200, 'total full');
    assert.deepStrictEqual(items, [
      { name: 'X', price: 50 },
      { name: 'Y', price: 150 },
    ], 'items all');
    assert.deepStrictEqual(cancelled, [], 'cancelled empty');
  }
}

runTests()
  .then(() => console.log('\nAll tests passed!'))
  .catch((err) => {
    console.error('\nTest failed:');
    console.error(err);
    process.exit(1);
  });
