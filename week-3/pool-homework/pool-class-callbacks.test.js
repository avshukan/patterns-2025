'use strict';

const assert = require('assert');

const { AsyncPool } = require('./pool-class-callbacks.js');

const POOL_MESSAGE = 'Async Pool Callbacks :: ';

async function runTests() {
    let counter = 1;
    const factory = () => ({ id: counter++ });

    const pool = new AsyncPool(factory, 2, 3);

    const results = [];

    // A
    await pool.acquire((a) => {
        assert.strictEqual(a.id, 1);
        results.push('A');

        // B
        pool.acquire((b) => {
            assert.strictEqual(b.id, 2);
            results.push('B');

            // C ожидает
            let c;
            pool.acquire((_c) => {
                c = _c;
                results.push('C');
                assert.strictEqual(c.id, 3);

                // D — переиспользуем объект b
                pool.release(b);
                pool.acquire((d) => {
                    assert.strictEqual(d, b);
                    results.push('D');

                    // Превышаем max
                    pool.release(c); // ok
                    pool.release(a); // ok
                    pool.release({ id: 999 }); // должен быть проигнорирован

                    // Три объекта: a, c, новый
                    const values = [];
                    pool.acquire((v1) => {
                        values.push(v1.id);
                        pool.acquire((v2) => {
                            values.push(v2.id);
                            pool.acquire((v3) => {
                                values.push(v3.id);

                                assert.deepStrictEqual(results, ['A', 'B', 'C', 'D']);
                                assert.ok(values.includes(1)); // a
                                assert.ok(values.includes(3)); // c
                                assert.ok(values.some((v) => v > 3 && v !== 999)); // новый

                                // console.log('✅ Все адаптированные тесты пройдены!');
                            });
                        });
                    });
                });
            });

            // simulate release with delay
            setTimeout(() => {
                pool.release({ id: 3 });
            }, 10);
        });
    });
};

runTests()
    .then(() => console.log(`\n${POOL_MESSAGE}All tests passed!`))
    .catch((err) => {
        console.error(`\n${POOL_MESSAGE}Test failed:`);
        console.error(err);
        process.exit(1);
    });
