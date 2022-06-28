const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {v4 : uuidv4} = require('uuid')

const {
    OrderDetails: { SCHEMA: { FIELDS: ORDERS_DETAILS_FIELDS, TABLE_NAME: ORDERS_DETAILS_TABLE_NAME }},
} = require("./../../model/child");

class orderDetails extends AbstractSQL {
  constructor(siteId) {
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
   * Add to orderDetails
   */
   save(params) {
    return new Promise((resolve, reject) => {
      let id = uuidv4();
      this.connection
        .query(QUERY_BUILDER.SAVE(id, params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(id);
        })
        .catch((error) => reject(error));
    })
  }

 orderDetailsByOrderId(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_ORDER_DETAIL_BY_ORDER_ID(id), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => resolve({}));
    })
  }
}

const QUERY_BUILDER = {
  SAVE: (id, params) => {
    let { orderId, productId, variantId, userid, quantity, price } = params;
    const query = `INSERT INTO ${ORDERS_DETAILS_TABLE_NAME} 
    ( ${ORDERS_DETAILS_FIELDS.ID},  ${ORDERS_DETAILS_FIELDS.ORDER_ID},  ${ORDERS_DETAILS_FIELDS.PRODUCT_ID},  ${ORDERS_DETAILS_FIELDS.VARIANT_ID},  ${ORDERS_DETAILS_FIELDS.USER_ID},  ${ORDERS_DETAILS_FIELDS.QUANTITY},  ${ORDERS_DETAILS_FIELDS.PRICE}) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return SqlString.format(query, [id,orderId, productId, variantId, userid, quantity, price]);
  },

  GET_ORDER_DETAIL_BY_ORDER_ID: (id) => {
    const query = ` SELECT  ${ORDERS_DETAILS_FIELDS.ID},  ${ORDERS_DETAILS_FIELDS.ORDER_ID},  ${ORDERS_DETAILS_FIELDS.PRODUCT_ID},  ${ORDERS_DETAILS_FIELDS.VARIANT_ID},  ${ORDERS_DETAILS_FIELDS.USER_ID},  ${ORDERS_DETAILS_FIELDS.QUANTITY},  ${ORDERS_DETAILS_FIELDS.PRICE}  FROM  ${ORDERS_DETAILS_TABLE_NAME}   WHERE   ${ORDERS_DETAILS_FIELDS.ORDER_ID}  = ?  `;
    return SqlString.format(query, [id])
  },
};

module.exports = orderDetails;
