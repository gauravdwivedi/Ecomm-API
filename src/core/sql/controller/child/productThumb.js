
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {v4 : uuidv4} = require('uuid')
const {
  Product: {SCHEMA:{FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}},
  ProductThumb: {SCHEMA:{FIELDS: PRODUCT_THUMB_FIELDS, TABLE_NAME: PRODUCT_THUMB_TABLE_NAME}},
} = require("./../../model/child");

class Product extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }

  like(productId, userId) {
    let id = uuidv4();
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.LIKE(id, productId, userId), super.getQueryType('INSERT')).then(result => {
        resolve(id)
      }).catch(error => reject(error));
    })
  }

  unlike(productId, userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.UNLIKE(productId, userId), super.getQueryType('DELETE')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }

  getLike(productId, userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_LIKE(productId, userId), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }
  
  count(productId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.COUNT(productId), super.getQueryType('SELECT')).then(result => {
        resolve(result && result[0] ? result[0].total : 0)
      }).catch(error => resolve(0));
    })
  }

  getLikesUserIds(productId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_LIKES_USER_IDS(productId), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => resolve([]));
    })
  }
}


  const QUERY_BUILDER = {  
    LIKE: (id, productId, userId) => {
      const data = {
        [PRODUCT_THUMB_FIELDS.ID] : id,
        [PRODUCT_THUMB_FIELDS.PRODUCT_ID] : productId,
        [PRODUCT_THUMB_FIELDS.USER_ID] : userId,
        [PRODUCT_THUMB_FIELDS.STATUS] : 1
      }
      return SqlString.format(`INSERT INTO ${PRODUCT_THUMB_TABLE_NAME} SET ?`, data)
    },
  
    UNLIKE: (productId, userId) => {
      const query = `DELETE FROM ${PRODUCT_THUMB_TABLE_NAME} 
        WHERE ${PRODUCT_THUMB_FIELDS.PRODUCT_ID} = ? AND ${PRODUCT_THUMB_FIELDS.USER_ID} = ?`;
      return SqlString.format(query, [productId, userId])
    },

    GET_LIKE: (productId, userId) => {
      const query = ` SELECT ${PRODUCT_THUMB_FIELDS.ID} 
      FROM ${PRODUCT_THUMB_TABLE_NAME} as c WHERE ${PRODUCT_THUMB_FIELDS.PRODUCT_ID} = ? AND ${PRODUCT_THUMB_FIELDS.USER_ID} = ?`;
      return SqlString.format(query, [productId, userId])
    },

    COUNT: (productId) => {
      const query = ` SELECT count(${PRODUCT_THUMB_FIELDS.ID}) as total 
      FROM ${PRODUCT_THUMB_TABLE_NAME} as c WHERE ${PRODUCT_THUMB_FIELDS.PRODUCT_ID} = ?`;
      return SqlString.format(query, [productId])
    },

    GET_LIKES_USER_IDS: (productId) => {
      const query = ` SELECT ${PRODUCT_THUMB_FIELDS.USER_ID} as userId, ${PRODUCT_THUMB_FIELDS.PRODUCT_ID} as productId
      FROM ${PRODUCT_THUMB_TABLE_NAME}
      WHERE ${PRODUCT_THUMB_FIELDS.PRODUCT_ID} = ?`;
    return SqlString.format(query, [productId])
    },
  }
  
  module.exports = Product;
  