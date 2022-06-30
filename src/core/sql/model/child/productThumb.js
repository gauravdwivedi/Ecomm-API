/**
* Module specific to productThumb table
*/

const TABLE_NAME = "product_thumb";
const FIELDS = {
  ID: "id", 
  USER_ID: "userId",
  PRODUCT_ID: "productId",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}

let productThumb = {};

productThumb.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = productThumb;