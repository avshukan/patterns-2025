'use strict';

const poolify = (factory, size, max) => {
  const instances = Array(size)
    .fill(null)
    .map(factory);

  return {
    acquire: () => instances.pop() ?? factory(),

    release: (instance) => {
      if (instance && instances.length < max) {
        instances.push(instance);
      }
    },

    get size() {
      return instances.length;
    },
  };
};

module.exports = { poolify };
