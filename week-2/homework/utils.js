'use strict';

const generateRandomTimeout = (min = 1000, max = 2000) => {
  const timeout = Math.floor(Math.random() * (max - min + 1)) + min;

  return timeout;
};

module.exports = {
  generateRandomTimeout,
};
