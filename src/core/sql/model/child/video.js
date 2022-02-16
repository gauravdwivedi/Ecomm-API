/**
* Module specific to video table
*/

const TABLE_NAME = "videos";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  NAME: "name",
  DISPLAY_NAME: "display_name",
  SRT: "srt",
  LIKE: "like",
  CREATE_TIME: "created_at",
  UPDATE_TIME: "updated_at",
  POSTER: "poster",
  THUMBNAIL: "thumbnail",
  SLUG: "slug",
  DESCRIPTION: "description",
  DURATION: "duration",
  HLS_MASTER_PUBLIC_URL: "hls_master_public_url",
  CAPTION_URL: "caption_url",
  ALT_TEXT: "alt_text",
  LINKED_PRODUCT_ID: "linked_product_id",
  LINKED_VIDEO_ID: "linked_video_id"
}

let video = {};

video.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = video;