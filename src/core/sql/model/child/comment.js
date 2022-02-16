/**
* Module specific to video table
*/

const TABLE_NAME = "comment";
const FIELDS = {
  ID: "id", 
  COMMENT: "comment",
  USER_ID: "user_id", 
  VIDEO_ID: "video_id",     
  CREATE_TIME: "create_time"
}

let comment = {};

comment.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = comment;