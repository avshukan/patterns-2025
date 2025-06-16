'use strict';

const { generateRandomTimeout } = require('./utils');

class PurchaseIterator {
    #purchases;

    constructor(purchase) {
        if (!Array.isArray(purchase)) {
            throw new Error('Purchases must be an array');
        }

        this.#purchases = purchase;
    }

    static create(purchase) {
        return new PurchaseIterator(purchase);
    }

    [Symbol.asyncIterator]() {
        let index = 0;

        return {
            next: async () => {
                if (index < this.#purchases.length) {
                    const purchase = this.#purchases[index];

                    // emulate a timeout for each purchase
                    // if the purchase has a timeout (test case),
                    // use it, otherwise use a random timeout
                    const timeout = purchase.timeout ??
                        generateRandomTimeout(200, 600);

                    console.log('timeout', { timeout });

                    const promise = new Promise((resolve) => setTimeout(() => {
                        const result = {
                            value: purchase,
                            done: false,
                        };

                        resolve(result);
                    }, timeout));

                    index += 1;

                    return promise;
                } else {
                    return {
                        value: null,
                        done: true,
                    };
                }
            },
        };
    };
};

module.exports = PurchaseIterator;
