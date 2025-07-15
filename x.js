'use strict';

function * gen() { yield 1; yield 2; return 3; };
const iter = gen();
console.log('[...iter]', [...iter]); // [1,2]

function * gen2() { yield 1; yield 2; yield 3; };
const iter2 = gen2();
console.log('[...iter2]', [...iter2]); // [1,2]
