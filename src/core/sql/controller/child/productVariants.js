
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {v4 : uuidv4} = require('uuid')
const {
  Variants: {SCHEMA:{FIELDS: VARIANTS_FIELDS, TABLE_NAME: VARIANTS_TABLE_NAME}},
} = require("./../../model/child");

class ProductVariants extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  

  saveProductVariants(productId, attributes) {
    return new Promise((resolve, reject) => {
      let a = [];
      attributes.map(attribute => {
        this.connection.query(QUERY_BUILDER.SAVE_PRODUCT_VARIANT(productId, attribute), super.getQueryType('INSERT')).then(result => {
          a.push(result && result[0] ? result[0] : "");
        }).catch(error => console.log(error));
      })
      resolve(a);
    })
  }

  getProductVariants = (product_id, size, color, min_price, max_price) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_VARIANTS(product_id, size, color, min_price, max_price), super.getQueryType('SELECT')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  updateProductVariant = (variant_id, params) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.UPDATE_PRODUCT_VARIANT(variant_id, params), super.getQueryType('UPDATE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  deleteProductVariant = (variant_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_VARIANT(variant_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  deleteProductVariantsByProductId = (product_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_VARIANTS_BY_PRODUCT_ID(product_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }
}



const QUERY_BUILDER = {

  SAVE_PRODUCT_VARIANT: (product_id, params) => {
    const { sku, size, color, qty_in_stock, price, discounted_price } = params;
    const data = {
      [VARIANTS_FIELDS.PRODUCT_ID] : product_id,
      [VARIANTS_FIELDS.SKU] : sku || '',
      [VARIANTS_FIELDS.SIZE] : size || '',
      [VARIANTS_FIELDS.COLOR] : color || '',
      [VARIANTS_FIELDS.QTY_IN_STOCK] : qty_in_stock || 0,
      [VARIANTS_FIELDS.PRICE] : price || 0,
      [VARIANTS_FIELDS.DISCOUNTED_PRICE] : discounted_price || price || 0,
      [VARIANTS_FIELDS.STATUS] : 1,
    }
    return SqlString.format(`INSERT INTO ${VARIANTS_TABLE_NAME} SET ${ [VARIANTS_FIELDS.ID]} = ${uuidv4()} , ?`, data)
  },

  GET_PRODUCT_VARIANTS: (product_id, size, color, min_price, max_price) => {
    let myQuery = `${VARIANTS_FIELDS.PRODUCT_ID} = ${product_id}`;
    myQuery += min_price ? ` AND ${VARIANTS_FIELDS.PRICE} >= ${min_price}` : '';
    myQuery += max_price ? ` AND ${VARIANTS_FIELDS.PRICE} <= ${max_price}` : '';
    myQuery += size ? ` AND ${VARIANTS_FIELDS.SIZE} = \'${size}\'` : '';
    myQuery += color ? ` AND ${VARIANTS_FIELDS.COLOR} = \'${color}\'` : '';
    const query = ` SELECT ${VARIANTS_FIELDS.ID}, ${VARIANTS_FIELDS.SKU}, ${VARIANTS_FIELDS.SIZE}, ${VARIANTS_FIELDS.COLOR}, ${VARIANTS_FIELDS.QTY_IN_STOCK}, ${VARIANTS_FIELDS.PRICE}, ${VARIANTS_FIELDS.DISCOUNTED_PRICE}, ${VARIANTS_FIELDS.STATUS}
      FROM ${VARIANTS_TABLE_NAME}
      WHERE ${myQuery}`;
    return SqlString.format(query, []);
  },

  UPDATE_PRODUCT_VARIANT: (variantId, params) => {
    const { sku, size, color, qty_in_stock, price, discounted_price } = params;
    const query = `UPDATE ${VARIANTS_TABLE_NAME} 
      SET ${VARIANTS_FIELDS.SKU} = ? ,
      ${VARIANTS_FIELDS.SIZE} = ? ,
      ${VARIANTS_FIELDS.COLOR} = ? ,
      ${VARIANTS_FIELDS.QTY_IN_STOCK} = ? ,
      ${VARIANTS_FIELDS.PRICE} = ?,
      ${VARIANTS_FIELDS.DISCOUNTED_PRICE} = ?
      WHERE ${VARIANTS_FIELDS.ID} = ?`;
    
    const queryParams = [sku, size, color, qty_in_stock, price, discounted_price, variantId];
    return SqlString.format(query, queryParams)
  },

  DELETE_PRODUCT_VARIANT: (variantId) => {
    const query = `DELETE FROM ${VARIANTS_TABLE_NAME}
      WHERE ${VARIANTS_FIELDS.ID} = ?`;
    
    const queryParams = [variantId];
    return SqlString.format(query, queryParams)
  },

  DELETE_PRODUCT_VARIANTS_BY_PRODUCT_ID: (id) => {
    const query = `DELETE FROM ${VARIANTS_TABLE_NAME} WHERE ${VARIANTS_FIELDS.PRODUCT_ID} = ${id}`;
    return SqlString.format(query, [])
  },
}


module.exports = ProductVariants;
