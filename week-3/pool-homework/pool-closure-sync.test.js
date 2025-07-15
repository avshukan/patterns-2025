'use strict';

const assert = require('assert');

const { poolify } = require('./pool-closure-sync');

const POOL_MESSAGE = 'Pool Closure Sync :: ';

const FILE_BUFFER_SIZE = 8; // Размер буфера для тестов

const POOL_INIT_SIZE = 2; // Начальный размер пула

const POOL_MAX_SIZE = 3; // Максимальный размер пула

async function runTests() {
    const createBuffer = (size) => new Uint8Array(size);

    const factory = () => createBuffer(FILE_BUFFER_SIZE);

    const pool = poolify(factory, POOL_INIT_SIZE, POOL_MAX_SIZE);

    // Тест 0: проверка создания пула
    assert.ok(pool, 'Pool should be created');
    assert.ok(typeof pool.acquire === 'function', 'Pool should have acquire method');
    assert.ok(typeof pool.release === 'function', 'Pool should have release method');

    // Тест 1: начальный размер
    assert.strictEqual(pool.size, POOL_INIT_SIZE, 'Pool should have initial size of 2');

    // Тест 2: acquire() уменьшает пул
    const inst1 = pool.acquire();
    assert.strictEqual(pool.size, 1, 'Pool size should be 1 after one acquire');

    const inst2 = pool.acquire();
    assert.strictEqual(pool.size, 0, 'Pool should be empty after two acquires');

    // Тест 3: acquire() создаёт новый экземпляр, если пул пуст
    const inst3 = pool.acquire();
    assert.ok(inst3 instanceof Uint8Array, 'Should return a buffer');
    assert.strictEqual(pool.size, 0, 'Pool should still be empty');

    // Тест 4: release() возвращает экземпляр в пул
    pool.release(inst3);
    assert.strictEqual(pool.size, 1, 'Pool should have 1 item after release');

    // Тест 5: release() не добавляет больше, чем max
    pool.release(inst1);
    pool.release(inst2);
    pool.release(factory()); // лишний экземпляр
    assert.strictEqual(pool.size, POOL_MAX_SIZE, 'Pool size should not exceed max');
};

runTests()
    .then(() => console.log(`\n${POOL_MESSAGE}All tests passed!`))
    .catch((err) => {
        console.error(`\n${POOL_MESSAGE}Test failed:`);
        console.error(err);
        process.exit(1);
    });
