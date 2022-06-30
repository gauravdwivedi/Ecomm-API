/**
* Module specific to variants table
*/

const TABLE_NAME = "variants";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "productId",
  SKU: "sku",
  SIZE: "size",
  COLOR: "color",
  QTY_IN_STOCK: "qtyInStock",
  PRICE: "price",
  DISCOUNTED_PRICE: "discountedPrice",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}


let variants = {};

variants.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = variants;