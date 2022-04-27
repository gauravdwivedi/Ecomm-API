/**
* Module specific to product_images table
*/

const TABLE_NAME = "product_images";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "product_id",
  URL: "url",
  STATUS: "status",
}


let product_images = {};

product_images.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = product_images;