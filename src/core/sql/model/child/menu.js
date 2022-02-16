/**
* Module specific to menu table
*/

const TABLE_NAME = "menu";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  NAME: "name",
  IS_PARENT: "is_parent",
  STATUS: "status",
  SHOWN: "shown",
  ORDER: "order",
  PARENT_ID: "parent_id",
  IS_USER_MENU: "is_user_menu",
  SLUG: "slug",
  CREATED_AT: "create_time",
  UPDATED_AT: "update_time",
}


let menu = {};

menu.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = menu;