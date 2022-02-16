/**
* Module specific to commentThumb table
*/

const TABLE_NAME = "comment_thumb";
const FIELDS = {
  ID: "id", 
  USER_ID: "user_id",
  COMMENT_ID: "comment_id",
  STATUS: "status"
}

let commentThumb = {};

commentThumb.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = commentThumb;