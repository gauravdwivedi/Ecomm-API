/**
* Module specific to saveProduct table
*/

const TABLE_NAME = "product_save";
const FIELDS = {
  ID: "id", 
  USER_ID: "user_id",
  PRODUCT_ID: "product_id",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updated_at"
}

let ProductSave = {};

ProductSave.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = ProductSave;