/**
* Module specific to menu table
*/

const TABLE_NAME = "product";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  NAME: "name",
  DESCRIPTION: "description",
  SIZE: "size",
  PRICE: "price",
  IMAGES: "images",
  DETAIL: "detail",
  SLUG: "slug",
}


let product = {};

product.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = product;