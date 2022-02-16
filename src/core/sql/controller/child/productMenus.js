
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {ProductMenus: {FIELDS: PRODUCT_MENUS_FIELDS, TABLE_NAME: PRODUCT_MENUS_TABLE_NAME}} = require("../../model/child");
const {Product: {SCHEMA: {FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}}} = require("../../model/child");

class Menu extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.tableName = PRODUCT_MENUS_TABLE_NAME;
    this.connection = super.connection();
  }
  
  /**
  * fetching for product
  * @param {*} siteId 
  */
  async fetchForProduct(siteId, slug){
    if(!siteId || !slug) return Promise.reject("fetchForProduct(): invalid/missing params");
    let query = `SELECT PM.${PRODUCT_MENUS_FIELDS.ID}, PM.${PRODUCT_MENUS_FIELDS.NAME}, PM.${PRODUCT_MENUS_FIELDS.ORDER}, PM.${PRODUCT_MENUS_FIELDS.PIVOT},
    PM.${PRODUCT_MENUS_FIELDS.SLUG}, PM.${PRODUCT_MENUS_FIELDS.ENTITY_SORT_TYPE}
    FROM ${this.tableName} AS PM
    INNER JOIN ${PRODUCT_TABLE_NAME} AS P ON P.${PRODUCT_FIELDS.ID} = PM.${PRODUCT_MENUS_FIELDS.PRODUCT_ID} AND P.${PRODUCT_FIELDS.SITE_ID} = ?
    WHERE P.${PRODUCT_FIELDS.SLUG} = ?
    ORDER BY PM.${PRODUCT_MENUS_FIELDS.ORDER}`;
    return await this.connection.query(SqlString.format(query, [siteId, slug]), super.getQueryType('SELECT'));
  }
}

module.exports = Menu;
