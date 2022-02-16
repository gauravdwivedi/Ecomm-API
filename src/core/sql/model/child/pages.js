/**
* Module specific to pages table
*/

const TABLE_NAME = "pages";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  NAME: "name",
  CONTENT: "content",
  SLUG: "slug",
  CREATE_TIME: "created_at",
  UPDATE_TIME: "updated_at"
}


module.exports = {
  TABLE_NAME, FIELDS
};