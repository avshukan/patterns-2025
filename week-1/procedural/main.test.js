'use strict';

const assert = require('assert');

const { main } = require('./main');

const { data } = require('./../fixture');

const expected =
  `  Lagos             16060303    1171   13712           Nigeria   100
  Delhi             16787941    1484   11313             India    83
  New York City      8537673     784   10892     United States    79
  Sao Paulo         12038175    1521    7914            Brazil    58
  Tokyo             13513734    2191    6168             Japan    45
  Mexico City        8874724    1486    5974            Mexico    44
  London             8673713    1572    5431    United Kingdom    40
  Shanghai          24256800    6340    3826             China    28
  Istanbul          14160467    5461    2593            Turkey    19`;

const result = main(data);

assert.strictEqual(result, expected, `Expected ${expected} but got ${result}`);

console.log('Test passed');
