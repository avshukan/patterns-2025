'use strict';

class Pool {
  constructor(factory, size, max) {
    this.factory = factory;
    this.max = max;
    this.instances = Array(size)
      .fill(null)
      .map(() => factory());
  }

  acquire() {
    return this.instances.pop() || this.factory();
  }

  release(instance) {
    if (instance && this.instances.length < this.max) {
      this.instances.push(instance);
    }
  }

  get size() {
    return this.instances.length;
  }
};

module.exports = { Pool };
