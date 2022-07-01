/**
* Module specific to menuvideo table
*/

const TABLE_NAME = "review";

const FIELDS = {
  ID: "id", 
  TEXT: "text",
  STAR: "star",
  ATTACHMENTS: "attachments",
  USER_ID: "userId",
  PRODUCT_ID: "productId",
  CREATE_TIME: "createdAt",
  STATUS: "status",
  UPDATE_TIME: "updatedAt",
  CREATED_AT: "createdAt"
}

let review = {};

review.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = review;