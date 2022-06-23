const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {v4 : uuidv4} = require('uuid')

const {
    Orders: { SCHEMA: { FIELDS: ORDERS_FIELDS, TABLE_NAME: ORDERS_TABLE_NAME }},
    Variants: { SCHEMA: { FIELDS: VARIANTS_FIELDS, TABLE_NAME: VARIANTS_TABLE_NAME }},
    Payments: { SCHEMA: { FIELDS: PAYMENTS_FIELDS, TABLE_NAME: PAYMENTS_TABLE_NAME }},
    PaymentMethods: { SCHEMA: { FIELDS: PAYMENTS_METHODS_FIELDS, TABLE_NAME: PAYMENTS_METHODS_TABLE_NAME }},
} = require("./../../model/child");

class Orders extends AbstractSQL {
  constructor(siteId) {
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
   * Add to Orders
   */
   newOrder(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.NEW_ORDER(params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  variantsByVariantId(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_VARIANTS_DETAIL_BY_VARIANT_ID(id), super.getQueryType('SELECT')).then(result => {
        resolve(result[0])
      }).catch(error => resolve({}));
    })
  }

  /**
   * cancel Order
   */
   orderStatusUpdate(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_STATUS_UPDATE(params), super.getQueryType("UPDATE"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * latest Order
   */
   latestOrder(params) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.LATEST_ORDER(params), super.getQueryType('SELECT')).then(result => {
        resolve(result[0])
      }).catch(error => resolve({}));
    })
  }

  /**
   * payment Order
   */
   payment(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.PAYMENT(params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * quantity Update
   */
   quantityUpdate(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.QUANTITY_UPDATE(params), super.getQueryType("UPDATE"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }
}

const QUERY_BUILDER = {
  NEW_ORDER: (params) => {
    let { userid, variantId, productId, quantity, status, deliveryStatus, addressId, priceBeforeTax, priceAfterTax, discount, notes, tax } = params;
    const query = `INSERT INTO ${ORDERS_TABLE_NAME} 
    (${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.VARIANT_ID}, ${ORDERS_FIELDS.PRODUCT_ID}, ${ORDERS_FIELDS.QUANTITY}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX}) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return SqlString.format(query, [uuidv4(),userid, variantId, productId, quantity, status, deliveryStatus, addressId, priceBeforeTax, priceAfterTax, discount, notes, tax]);
  },

  
  ORDER_STATUS_UPDATE: (params) => {
    let { status, id } = params;
    let data = [status, id];
    let query = `UPDATE ${ORDERS_TABLE_NAME} SET ${ORDERS_FIELDS.STATUS} = ? WHERE ${ORDERS_FIELDS.ID} = ?`;
    return SqlString.format(query, data);
  },

  GET_VARIANTS_DETAIL_BY_VARIANT_ID: (id) => {
    const query = ` SELECT ${VARIANTS_FIELDS.PRICE} , ${VARIANTS_FIELDS.QTY_IN_STOCK}
      FROM ${VARIANTS_TABLE_NAME}
      WHERE ${VARIANTS_FIELDS.ID} = ?`;
    return SqlString.format(query, [id])
  },

  LATEST_ORDER: (params) => {
    let {  userId ,status,method } = params;
    const query = ` SELECT * , (SELECT  ${PAYMENTS_METHODS_FIELDS.ID} FROM ${PAYMENTS_METHODS_TABLE_NAME} WHERE  ${PAYMENTS_METHODS_FIELDS.TYPE} = ? ) AS methodId FROM  ${ORDERS_TABLE_NAME} WHERE ${ORDERS_FIELDS.USER_ID} = ? AND  ${ORDERS_FIELDS.STATUS} = ?   
     ORDER BY  ${ORDERS_FIELDS.CREATED_AT} DESC LIMIT 1`;
    return SqlString.format(query, [method, userId ,status ])
  },

  PAYMENT: (params) => {
    let {  id,order_id,invoice_id,orderId,methodId,status } = params;
    let query = `INSERT INTO  ${PAYMENTS_TABLE_NAME} (${PAYMENTS_FIELDS.ID}, ${PAYMENTS_FIELDS.INVOICE_ID}, ${PAYMENTS_FIELDS.RAZOR_PAY_ORDER_ID}, ${PAYMENTS_FIELDS.ORDER_ID}, ${PAYMENTS_FIELDS.PAYMENT_METHOD_ID}, ${PAYMENTS_FIELDS.PAYMENT_STATUS}) 
                VALUES (?,?,?,?,?,?)`;
    return SqlString.format(query, [id,invoice_id,order_id,orderId,methodId,status]);
  },

  QUANTITY_UPDATE: (params) => {
    let {  qty , id} = params;
    let query = `UPDATE ${VARIANTS_TABLE_NAME} SET ${VARIANTS_FIELDS.QTY_IN_STOCK}= ? WHERE ${VARIANTS_FIELDS.ID} = ?`;
    return SqlString.format(query, [qty , id]);
  },
};

module.exports = Orders;
