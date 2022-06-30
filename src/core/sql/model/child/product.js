/**
* Module specific to menu table
*/

const TABLE_NAME = "product";
const FIELDS = {
  ID: "id",
  CATEGORY: "category",
  TITLE: "title",
  DESCRIPTION: "description",
  RATING: "rating",
  SLUG: "slug",
  STATUS: 'status',
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}


let product = {};

product.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = product;