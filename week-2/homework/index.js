'use strict';

const purchase = require('../fixture.json');

const main = require('./main');

main(purchase)
  .then((result) => {
    console.log('Basket processed successfully:', result);
  })
  .catch((error) => {
    console.error('Error processing basket:', error);
  });
