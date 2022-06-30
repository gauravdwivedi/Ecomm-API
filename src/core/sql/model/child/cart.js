/**
* Module specific to cart table
*/

const TABLE_NAME = "cart";
const FIELDS = {
  ID: "id",
  USER_ID: "userId",
  PRODUCT_ID: "productId",
  VARIANT_ID: "variantId",
  QUANTITY: "quantity",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}

let cart = {};

cart.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = cart;