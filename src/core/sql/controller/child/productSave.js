
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

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
    return new Promise((resolve, reject) => {
        this.connection.query(QUERY_BUILDER.SAVE(productId, userId), super.getQueryType('INSERT')).then(result => {
          resolve(result[0])
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

  }

  const QUERY_BUILDER ={

    SAVE:(productId, userId) =>{
        const data ={
            [PRODUCT_SAVE_FIELDS.PRODUCT_ID]:productId,
            [PRODUCT_SAVE_FIELDS.USER_ID]:userId,
            [PRODUCT_SAVE_FIELDS.STATUS]:1
        }

        return SqlString.format(`INSERT INTO ${PRODUCT_SAVE_TABLE_NAME} SET ?`, data)
    },
  
    DELETE: (productId, userId) => {
      const query = `DELETE FROM ${PRODUCT_SAVE_TABLE_NAME} 
        WHERE ${PRODUCT_SAVE_FIELDS.PRODUCT_ID} = ${productId} AND ${PRODUCT_SAVE_FIELDS.USER_ID} = ${userId}`;
      return SqlString.format(query, [])
    }
  }
  
  module.exports = ProductSave;
  