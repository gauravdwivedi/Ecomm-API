/**
* Module specific to video table
*/

const TABLE_NAME = "like_video";
const FIELDS = {
  ID: "id", 
  USER_ID: "user_id", 
  VIDEO_ID: "video_id",     
  LIKE: "like"
}

let likeVideo = {};

likeVideo.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = likeVideo;