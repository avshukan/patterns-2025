'use strict';

class Basket {
    #limit;
    #onEnd;
    #addedItems = [];
    #cancelledItems = [];

    constructor(options = {}, onEnd = () => { }) {
        this.#limit = options.limit ?? 0;

        this.#onEnd = onEnd;
    }

    add(item) {
        if (this.#limit >= item.price) {
            this.#limit -= item.price;
            this.#addedItems.push(item);
        }   else {
            this.#cancelledItems.push(item);
        }
    }

    end() {
        const items = this.#addedItems;
        const total = this.#addedItems.reduce(
            (acc, item) => acc + item.price,
            0,
        );
        const cancelled = this.#cancelledItems;
        const cart = {
            items,
            total,
            cancelled,
            then: (onFullfilled) => {
                this.#onEnd(items, total, cancelled);

                onFullfilled({
                    items,
                    total,
                    cancelled,
                });
            },
        };
        return cart;
    }
}

module.exports = Basket;
