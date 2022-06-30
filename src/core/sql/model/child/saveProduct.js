/**
* Module specific to saveProduct table
*/

const TABLE_NAME = "product_save";
const FIELDS = {
  ID: "id", 
  USER_ID: "userId",
  PRODUCT_ID: "productId",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}

let ProductSave = {};

ProductSave.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = ProductSave;