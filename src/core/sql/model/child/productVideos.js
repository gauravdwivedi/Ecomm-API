/**
* Module specific to video table
*/

const TABLE_NAME = "product_videos";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "productId",
  NAME: "name",
  THUMBNAIL: "thumbnail",
  SLUG: "slug",
  DESCRIPTION: "description",
  URL: "url",
  CREATE_TIME: "createdAt",
  UPDATE_TIME: "updatedAt"
}

let video = {};

video.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = video;