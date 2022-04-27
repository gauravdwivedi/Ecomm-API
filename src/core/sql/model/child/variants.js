/**
* Module specific to variants table
*/

const TABLE_NAME = "variants";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "product_id",
  SKU: "sku",
  SIZE: "size",
  COLOR: "color",
  QTY_IN_STOCK: "qty_in_stock",
  PRICE: "price",
  DISCOUNTED_PRICE: "discounted_price",
  STATUS: "status",
}


let variants = {};

variants.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = variants;