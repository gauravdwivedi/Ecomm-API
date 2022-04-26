
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {
  Category: {SCHEMA:{FIELDS:  CATEGORY_FIELDS, TABLE_NAME:  CATEGORY_TABLE_NAME}},
 
} = require("./../../model/child");

class Category extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
  * Add Category
  */
   addCategory(params, callback){
    this.connection.query(QUERY_BUILDER.SAVE(params), super.getQueryType('INSERT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }


  /**
  * Fetch List
  */
   fetchList(callback){
    this.connection.query(QUERY_BUILDER.FETCH_LIST(), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }


  /**
  * Update Category Detail by ID
  */
   updateDetailByID(params, callback){
    this.connection.query(QUERY_BUILDER.UPDATE_DETAIL_BY_ID(params), super.getQueryType('UPDATE')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Delete Category
  */
   deleteCategory(categoryId, callback){
    this.connection.query(QUERY_BUILDER.DELETE_CATEGORY_BY_ID(categoryId), super.getQueryType('DELETE')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
}


const QUERY_BUILDER = {
  
  SAVE: (params) => {
    let { title, icon,status } = params;
    const query = `INSERT INTO ${CATEGORY_TABLE_NAME}
    (${CATEGORY_FIELDS.TITLE}, ${CATEGORY_FIELDS.ICON} , ${CATEGORY_FIELDS.STATUS})
    VALUES(?,?,?)
    ON DUPLICATE KEY
    UPDATE ${CATEGORY_FIELDS.TITLE}=?`;
    return SqlString.format(query, [title, icon,status,title])
  },
  FETCH_LIST: () => {
    const query = `SELECT id, title, icon, status FROM ${CATEGORY_TABLE_NAME}`;
    return SqlString.format(query, [])
  },
  
  UPDATE_DETAIL_BY_ID: (params) => {
    let { title, icon,status, categoryId } = params;
    let values = [];
    let query = `UPDATE ${CATEGORY_TABLE_NAME} `;
    if(title){
      query += `SET ${CATEGORY_FIELDS.TITLE} = ? `;
      values.push(title);
    }
    if(icon){
      query +=  (title) ?  " , " : " SET ";
      query += ` ${CATEGORY_FIELDS.ICON} = ? `;
      values.push(icon);
    }

    if(status){
      query +=  (icon) ?  " , " : " SET ";
      query += ` ${CATEGORY_FIELDS.STATUS} = ? `;
      values.push(status);
    }

    query += ` WHERE ${CATEGORY_FIELDS.ID} = ?`;
    values.push(categoryId);
    return SqlString.format(query, values)
  },
  DELETE_CATEGORY_BY_ID: (categoryId) => {
    const query = `DELETE FROM ${CATEGORY_TABLE_NAME} WHERE ${CATEGORY_FIELDS.ID} = ?`;
    return SqlString.format(query, [categoryId])
  }
}

module.exports = Category;