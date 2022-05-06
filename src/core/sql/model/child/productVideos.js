/**
* Module specific to video table
*/

const TABLE_NAME = "product_videos";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "product_id",
  NAME: "name",
  THUMBNAIL: "thumbnail",
  SLUG: "slug",
  DESCRIPTION: "description",
  URL: "url",
  CREATE_TIME: "created_at",
  UPDATE_TIME: "updated_at"
}

let video = {};

video.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = video;