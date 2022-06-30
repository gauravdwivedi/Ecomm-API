/**
* Module specific to commentThumb table
*/

const TABLE_NAME = "comment_thumb";
const FIELDS = {
  ID: "id", 
  USER_ID: "userId",
  COMMENT_ID: "commentId",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}

let commentThumb = {};

commentThumb.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = commentThumb;