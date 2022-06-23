
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {v4 : uuidv4} = require('uuid')
const {
  ProductSave: {SCHEMA:{FIELDS: PRODUCT_SAVE_FIELDS, TABLE_NAME: PRODUCT_SAVE_TABLE_NAME}},
} = require("./../../model/child");

class ProductSave extends AbstractSQL{
    
  constructor(siteId){
      console.log('')
    super(siteId);
    this.connection = super.connection();
  }

  save(productId,userId){
    let id = uuidv4();
    return new Promise((resolve, reject) => {
        this.connection.query(QUERY_BUILDER.SAVE(id, productId, userId), super.getQueryType('INSERT')).then(result => {
          resolve(id)
        }).catch(error => reject(error));
      })
  }

  delete(productId, userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE(productId, userId), super.getQueryType('DELETE')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }

  getFavouritesUserIds(productId){
    return new Promise((resolve, reject) => {
        this.connection.query(QUERY_BUILDER.GET_SAVED_USER_IDS(productId), super.getQueryType('SELECT')).then(result => {
          resolve(result)
        }).catch(error => resolve([]));
      })
  }

  list(userId){
    return new Promise((resolve,reject)=>{
      this.connection.query(QUERY_BUILDER.LIST(userId),super.getQueryType('SELECT')).then(result => {
        console.log('Favourite list',result)
        resolve(result)
      }).catch(error => resolve([]))
    })
  }

  }

  const QUERY_BUILDER ={

    LIST:(userId)=>{
        return SqlString.format(`SELECT * FROM ${PRODUCT_SAVE_TABLE_NAME} WHERE ${PRODUCT_SAVE_FIELDS.USER_ID} = ?`, [userId])
    },

    SAVE:(id, productId, userId) =>{
        const data ={
            [PRODUCT_SAVE_FIELDS.ID]: id,
            [PRODUCT_SAVE_FIELDS.PRODUCT_ID]:productId,
            [PRODUCT_SAVE_FIELDS.USER_ID]:userId,
            [PRODUCT_SAVE_FIELDS.STATUS]:1
        }

        return SqlString.format(`INSERT INTO ${PRODUCT_SAVE_TABLE_NAME} SET ?`, data)
    },
  
    DELETE: (productId, userId) => {
      const query = `DELETE FROM ${PRODUCT_SAVE_TABLE_NAME} 
        WHERE ${PRODUCT_SAVE_FIELDS.PRODUCT_ID} = ? AND ${PRODUCT_SAVE_FIELDS.USER_ID} = ?`;
      return SqlString.format(query, [productId, userId])
    },

    GET_SAVED_USER_IDS: (productId) =>{
        const query = `SELECT ${PRODUCT_SAVE_FIELDS.USER_ID} as userId, ${PRODUCT_SAVE_FIELDS.PRODUCT_ID} as productId 
        FROM ${PRODUCT_SAVE_TABLE_NAME}
        WHERE ${PRODUCT_SAVE_FIELDS.PRODUCT_ID} = ?`;

        return SqlString.format(query,[productId])
    }
  }
  
  module.exports = ProductSave;
  