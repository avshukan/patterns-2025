'use strict';

const init = require('eslint-config-metarhia');

module.exports = [
  ...init,
  {
    ignores: ['**/*-granular.js', '**/*-bad.js'],
    rules: {
      'max-len': ['error', { code: 120 }], // Set max line length to 120
      'max-nested-callbacks': ['error', 10], // Limit nested callbacks to 3
    },
  },
];
