
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {Menu: {SCHEMA:{FIELDS: MENU_FIELDS, TABLE_NAME: MENU_TABLE_NAME}}} = require("../../model/child");

class Menu extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }
  
  /**
  * fetching for site
  */
  fetchForSite(callback){
    this.connection.query(QUERY_BUILDER.GET_LIST(this.siteId), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  getMenuId(slug, callback){
    this.connection.query(QUERY_BUILDER.GET_MENU_ID(slug), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : {})
    }).catch(error => callback(error, null));
  }

  getSubCategories(id, callback){
    this.connection.query(QUERY_BUILDER.GET_SUB_CATEGORIES_LIST(id), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  getAllMenuId(callback){
    this.connection.query(QUERY_BUILDER.GET_ALL_MENU_ID(), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  getAllSubMenuId(menuIDs, callback){
    this.connection.query(QUERY_BUILDER.GET_SUB_MENU_ID(menuIDs), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
}


const QUERY_BUILDER = {
  
  GET_LIST: (siteId) => {
    const query = `SELECT ${MENU_FIELDS.ID}, ${MENU_FIELDS.NAME}, \`${MENU_FIELDS.ORDER}\`, ${MENU_FIELDS.PARENT_ID}, ${MENU_FIELDS.SLUG}, ${MENU_FIELDS.IS_USER_MENU} as isUserMenu, ${MENU_FIELDS.UPDATED_AT} as updatedAt FROM ${MENU_TABLE_NAME} WHERE ${MENU_FIELDS.SITE_ID} = ? AND ${MENU_FIELDS.STATUS} = 1 AND ${MENU_FIELDS.SHOWN} = 1 order by \`${MENU_FIELDS.ORDER}\``;
    return SqlString.format(query, [siteId])
  },

  GET_MENU_ID: (slug) =>{
    const query = `SELECT ${MENU_FIELDS.ID}, ${MENU_FIELDS.PARENT_ID} as parentId FROM ${MENU_TABLE_NAME} WHERE ${MENU_FIELDS.SLUG} = ? AND ${MENU_FIELDS.STATUS} = 1 `;
    return SqlString.format(query, [slug])
  },

  GET_ALL_MENU_ID: () =>{
    const query = `SELECT ${MENU_FIELDS.ID}, ${MENU_FIELDS.SLUG} as slug FROM ${MENU_TABLE_NAME} WHERE ${MENU_FIELDS.IS_USER_MENU} = 0 AND ${MENU_FIELDS.STATUS} = 1 AND ${MENU_FIELDS.IS_PARENT} = 1 AND ${MENU_FIELDS.SHOWN} = 1`;
    return SqlString.format(query, [])
  },

  GET_SUB_MENU_ID: (menuIDs) =>{
    const query = `SELECT ${MENU_FIELDS.ID}, ${MENU_FIELDS.SLUG} as slug, ${MENU_FIELDS.PARENT_ID} as parentId FROM ${MENU_TABLE_NAME} WHERE ${MENU_FIELDS.PARENT_ID} IN (${menuIDs.join(',')}) AND ${MENU_FIELDS.STATUS} = 1 AND ${MENU_FIELDS.SHOWN} = 1 `;
    return SqlString.format(query, [])
  },

  GET_SUB_CATEGORIES_LIST: (id) =>{
    const query = `SELECT ${MENU_FIELDS.ID} FROM ${MENU_TABLE_NAME} WHERE ${MENU_FIELDS.PARENT_ID} = ? AND ${MENU_FIELDS.STATUS} = 1 AND ${MENU_FIELDS.SHOWN} = 1 `;
    return SqlString.format(query, [id])
  }
}

module.exports = Menu;
