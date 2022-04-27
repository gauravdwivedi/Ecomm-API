/**
* Module specific to menu table
*/

const TABLE_NAME = "product";
const FIELDS = {
  ID: "id",
  CATEGORY: "category",
  TITLE: "title",
  ATTRIBUTES: "attributes",
  VIDEO_URL: "video_url",
  RATING: "rating",
  SLUG: "slug",
  DESCRIPTION: "description",
  STATUS: 'status'
}


let product = {};

product.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = product;