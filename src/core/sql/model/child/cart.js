/**
* Module specific to cart table
*/

const TABLE_NAME = "cart";
const FIELDS = {
  ID: "id",
  USER_ID: "user_id",
  PRODUCT_ID: "product_id",
  VARIANT_ID: "variant_id",
  QUANTITY: "quantity",
  STATUS: "status",
}

let cart = {};

cart.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = cart;