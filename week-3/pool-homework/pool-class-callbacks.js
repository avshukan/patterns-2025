'use strict';

class AsyncPool {
  #queue = [];
  #instances = [];

  constructor(factory, size, max) {
    this.factory = factory;
    this.max = max;
    this.#instances = Array(size)
      .fill(null)
      .map(() => factory());
  }

  async acquire(callback) {
    const instance = this.#instances.pop();
    if (instance) {
      callback(instance);
    } else {
      this.#queue.push(callback);
    }
  }

  async release(instance) {
    if (this.#queue.length > 0) {
      const callback = this.#queue.shift();
      callback(instance);
      return;
    }
    if (this.#instances.length < this.max) {
      this.#instances.push(instance);
    }
  }

  get size() {
    return this.#instances.length;
  }
} ;

module.exports = { AsyncPool };
