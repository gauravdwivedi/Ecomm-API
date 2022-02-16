
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {ProductMenuEntity: {FIELDS: PRODUCT_MENU_ENTITY_FIELDS, TABLE_NAME: PRODUCT_MENU_ENTITY_TABLE_NAME}} = require("../../model/child");
const {Video: {SCHEMA: {FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}}} = require("../../model/child");
const {Pages: {FIELDS: PAGE_FIELDS, TABLE_NAME: PAGE_TABLE_NAME}} = require("../../model/child");
const {ProductMenus: {FIELDS: PRODUCT_MENUS_FIELDS, TABLE_NAME: PRODUCT_MENUS_TABLE_NAME}} = require("../../model/child");
const {Product: {SCHEMA: {FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}}} = require("../../model/child");

class ProductMenuEntity extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.tableName = PRODUCT_MENU_ENTITY_TABLE_NAME;
    this.connection = super.connection();
  }
  
  async fetchLinkedEntities(siteId, slug, productSlug){
    if(!siteId || !slug) return Promise.reject("fetchLinkedEntities(): invalid/missing params");
    let query = ` SELECT
    ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_ID}, ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_TYPE}, ME.${PRODUCT_MENU_ENTITY_FIELDS.ORDER},
    V.${VIDEO_FIELDS.ID} AS ${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.ID}, 
    V.${VIDEO_FIELDS.NAME} AS ${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.NAME}, 
    V.${VIDEO_FIELDS.DESCRIPTION} AS ${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.DESCRIPTION}, 
    V.${VIDEO_FIELDS.THUMBNAIL} AS ${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.THUMBNAIL}, 
    V.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} AS ${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL},
    V.${VIDEO_FIELDS.CAPTION_URL},
    PG.${PAGE_FIELDS.ID} AS ${PAGE_TABLE_NAME}_${PAGE_FIELDS.ID},
    PG.${PAGE_FIELDS.NAME} AS ${PAGE_TABLE_NAME}_${PAGE_FIELDS.NAME},
    PG.${PAGE_FIELDS.CONTENT} AS ${PAGE_TABLE_NAME}_${PAGE_FIELDS.CONTENT}
    FROM ${this.tableName} AS ME
    INNER JOIN ${PRODUCT_MENUS_TABLE_NAME} AS PM ON PM.${PRODUCT_MENUS_FIELDS.ID} = ME.${PRODUCT_MENU_ENTITY_FIELDS.MENU_ID}
    LEFT JOIN ${VIDEO_TABLE_NAME} AS V ON V.${VIDEO_FIELDS.ID} = ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_ID} AND ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_TYPE} = 'video' AND V.${VIDEO_FIELDS.SITE_ID} = ?
    LEFT JOIN ${PAGE_TABLE_NAME} AS PG ON PG.${PAGE_FIELDS.ID} = ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_ID} AND ME.${PRODUCT_MENU_ENTITY_FIELDS.ENTITY_TYPE} = 'page' AND PG.${PAGE_FIELDS.SITE_ID} = ?
    INNER JOIN ${PRODUCT_TABLE_NAME} AS P ON P.${PRODUCT_FIELDS.ID} = PM.${PRODUCT_MENUS_FIELDS.PRODUCT_ID}
    WHERE PM.${PRODUCT_MENUS_FIELDS.SLUG} = ?
    AND P.${PRODUCT_MENUS_FIELDS.SLUG} = ?
    ORDER BY ME.${PRODUCT_MENU_ENTITY_FIELDS.ORDER} ASC`;
    return await this.connection.query(SqlString.format(query, [siteId, siteId, slug, productSlug]), super.getQueryType('SELECT'));
  }
}

module.exports = ProductMenuEntity;
