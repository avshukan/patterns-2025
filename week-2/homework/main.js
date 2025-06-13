'use strict';

// Create Iterator for given dataset with Symbol.asyncIterator
// Use for..of to iterate it and pass data to Basket
// Basket is limited to certain amount
// After iteration ended Basket should return Thenable
// to notify us with final list of items, total and
// escalated errors

const PurchaseIterator = require('./purchase-iterator');

const Basket = require('./basket');

const main = async (purchase) => {
  const goods = PurchaseIterator.create(purchase);
  const basket = new Basket({ limit: 1050 }, (items, total) => {
    console.log(total);
  });
  // Hint: call async function without await
  for await (const item of goods) {
    basket.add(item);
  }
  // Hint: Add backet.end();
};

module.exports = main;
