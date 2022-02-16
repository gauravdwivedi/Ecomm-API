/**
* Module specific to video table
*/

const TABLE_NAME = "metadata";
const FIELDS = {
  ID: "id", 
  ENTITY_ID: "entity_id",
  ENTITY_TYPE: "entity_type", 
  TITLE: "title",     
  KEYWORDS: "keywords", 
  DESCRIPTION: "description", 
  OG_TITLE: "og_title", 
  OG_IMAGE: "og_image", 
  OG_DESCRIPTIOn: "og_description"
}

let metadata = {};

metadata.SCHEMA = {
  TABLE_NAME,
  FIELDS
}

module.exports = metadata;