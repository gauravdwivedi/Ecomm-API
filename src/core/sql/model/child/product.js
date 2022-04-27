/**
* Module specific to menu table
*/

const TABLE_NAME = "product";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  CATEGORY: "category",
  TITLE: "title",
  ATTRIBUTES: "attributes",
  VIDEO_URL: "video_url",
  PRICE: "price",
  IMAGES: "images",
  QTY_IN_STOCK: "qty_in_stock",
  DISCOUNTED_PRICE: "discounted_price",
  RATING: "rating",
  SLUG: "slug",
  DESCRIPTION: "description"
}


let product = {};

product.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = product;