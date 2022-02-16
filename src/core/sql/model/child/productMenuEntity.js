/**
* Module specific to product_menu_entity table
*/

const TABLE_NAME = "product_menu_entity";
const FIELDS = {
  ID: "id",
  MENU_ID: "menu_id",
  ENTITY_ID: "entity_id",
  ENTITY_TYPE: "entity_type",
  ORDER: "order",
  CREATED_TIME: "created_time",
  UPDATED_TIME: "updated_time",
}


module.exports = {
  TABLE_NAME, FIELDS
};