/**
* Module specific to category table
*/

const TABLE_NAME = "category";
const FIELDS = {
  ID: "id",
  TITLE: "title",
  ICON: "icon",
  SLUG: "slug",
  STATUS: "status",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}


let category = {};

category.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = category;