/**
* Module specific to menuvideo table
*/

const TABLE_NAME = "review";

const FIELDS = {
  ID: "id", 
  TEXT: "text",
  STAR: "star",
  ATTACHMENTS: "attachments",
  USER_ID: "user_id",
  PRODUCT_ID: "product_id",
  CREATE_TIME: "created_at",
  STATUS: "status",
  UPDATE_TIME: "updated_at",
  CREATED_AT: "createdAt"
}

let review = {};

review.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = review;