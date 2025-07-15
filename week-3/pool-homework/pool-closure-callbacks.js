'use strict';

const poolifyAsync = (factory, size, max) => {
  const instances = Array(size)
    .fill(null)
    .map(factory);

  const queue = [];

  return {
    acquire: async (callback) => {
      const instance = instances.pop();
      if (instance) {
        callback(instance);
      } else {
        queue.push(callback);
      }
    },

    release: async (instance) => {
      if (queue.length > 0) {
        const callback = queue.shift();
        callback(instance);
        return;
      }

      if (instances.length < max) {
        instances.push(instance);
      }
    },

    get size() {
      return instances.length;
    },
  };
};

module.exports = { poolifyAsync };
