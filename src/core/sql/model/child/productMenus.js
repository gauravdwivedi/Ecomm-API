/**
* Module specific to product_menus table
*/

const TABLE_NAME = "product_menus";
const FIELDS = {
  ID: "id",
  PRODUCT_ID: "product_id",
  NAME: "name",
  ORDER: "order",
  SLUG: "slug",
  PIVOT: "pivot",
  STATUS: "status",
  ENTITY_SORT_TYPE: "entity_sort_type",
  CREATED_TIME: "created_time",
  UPDATED_TIME: "updated_time",
}


module.exports = {
  TABLE_NAME, FIELDS
};