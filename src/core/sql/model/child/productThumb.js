/**
* Module specific to productThumb table
*/

const TABLE_NAME = "product_thumb";
const FIELDS = {
  ID: "id", 
  USER_ID: "user_id",
  PRODUCT_ID: "product_id",
  STATUS: "status"
}

let productThumb = {};

productThumb.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = productThumb;