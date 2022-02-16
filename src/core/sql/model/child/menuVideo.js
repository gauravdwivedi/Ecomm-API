/**
* Module specific to menuvideo table
*/

const TABLE_NAME = "menu_video";

const FIELDS = {
  MENU_ID: "menu_id", 
  VIDEO_ID: "video_id",
  ORDER: "order"
}

let menuVideo = {};

menuVideo.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = menuVideo;