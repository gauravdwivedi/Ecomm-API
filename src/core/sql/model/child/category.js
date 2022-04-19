/**
* Module specific to category table
*/

const TABLE_NAME = "category";
const FIELDS = {
  ID: "id",
  TITLE: "title",
}


let category = {};

category.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = category;