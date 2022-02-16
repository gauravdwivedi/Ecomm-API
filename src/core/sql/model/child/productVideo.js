/**
* Module specific to menuvideo table
*/

const TABLE_NAME = "product_videos";

const FIELDS = {
  PRODUCT_ID: "product_id", 
  VIDEO_ID: "video_id",
  ORDER: "order",
  IS_INTRO: "is_intro"
}

let productVideo = {};

productVideo.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = productVideo;