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
      let id = uuidv4();
      this.connection
        .query(QUERY_BUILDER.NEW_ORDER(id, params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(id);
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
   *  Order status update
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
   *  Order price update
   */
   orderPriceUpdate(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_PRICE_UPDATE(params), super.getQueryType("UPDATE"))
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
      let id = uuidv4();
      this.connection
        .query(QUERY_BUILDER.PAYMENT(id, params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(id);
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

  /**
   * order list from user
   */
   orders(id) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_LIST_BY_USER_ID(id), super.getQueryType("SELECT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * order details by id
   */
   orderDetailsById(id) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_DETAILS_BY_ID(id), super.getQueryType("SELECT"))
        .then((result) => {
          resolve(result[0]);
        })
        .catch((error) => reject(error));
    })
  }

  addressIdByPaymentId(id){
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_ADDRESSID_BY_PAYMENT_ID(id), super.getQueryType("SELECT"))
        .then((result) => {
          resolve(result[0]);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * get all orders
   */
   allOrders() {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ORDER_LIST(), super.getQueryType("SELECT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * Change Order Status
   */
  changeStatus(){
    return new Promise((resolve,reject)=>{
      this.connection
      .query(QUERY_BUILDER.CHANGE_ORDER_STATUS(),super.getQueryType("UPDATE"))
      .then((result)=>{
        resolve(result)
      })
      .catch((error)=>reject(error))  
    })
  }


  /**
   * order list from user where order is completed
   */
   completedOrders(id) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.COMPLETED_ORDER_LIST_BY_USER_ID(id), super.getQueryType("SELECT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }


/**
 * Payment list
 */

paymentList(){
  return new Promise((resolve,reject)=>{
    console.log('payment List')
    this.connection
    .query(QUERY_BUILDER.PAYMENT_LIST(), super.getQueryType("SELECT"))
    .then((result)=>{
      resolve(result);
    })
    .catch((error) => reject(error));
  })
}


/**
 * Order Count
 */

orderCount(){
  return new Promise((resolve,reject)=>{
    this.connection
    .query(QUERY_BUILDER.ORDER_COUNT(), super.getQueryType("SELECT"))
    .then((result)=>{
      resolve(result);
    })
    .catch((error) => reject(error));
  })
}

completedOrderCount(){
    return new Promise((resolve,reject)=>{
      this.connection
      .query(QUERY_BUILDER.COMPLETED_ORDER_COUNT(), super.getQueryType("SELECT"))
      .then((result)=>{
        resolve(result);
      })
      .catch((error) => reject(error));
    })
}

allPendingOrders(){
  return new Promise((resolve,reject)=>{
    this.connection
    .query(QUERY_BUILDER.ALL_PENDING_ORDERS(), super.getQueryType("SELECT"))
    .then((result)=>{
      resolve(result);
    })
    .catch((error) => reject(error));
  })
}


weeklyCompletedOrders(){
  return new Promise((resolve,reject)=>{
    this.connection
    .query(QUERY_BUILDER.WEEK_COMPLETED_ORDERS(), super.getQueryType("SELECT"))
    .then((result)=>{
      console.log('WEEK REsult',result)
      resolve(result);
    })
    .catch((error) => reject(error));
  })
}

}



const QUERY_BUILDER = {
  NEW_ORDER: (id, params) => {
    let { userid, status, deliveryStatus, addressId, priceBeforeTax, priceAfterTax, discount, notes, tax } = params;
    const query = `INSERT INTO ${ORDERS_TABLE_NAME} 
    (${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX}) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    return SqlString.format(query, [id,userid, status, deliveryStatus, addressId, priceBeforeTax, priceAfterTax, discount, notes, tax]);
  },

  ORDER_STATUS_UPDATE: (params) => {
    
    let {status,id} = params;
    let data = [status,id];
    let query = `UPDATE ${ORDERS_TABLE_NAME} SET ${ORDERS_FIELDS.DELIVERY_STATUS} = ? WHERE ${ORDERS_FIELDS.ID} = ?`;
    return SqlString.format(query, data);
  },

  

  ORDER_PRICE_UPDATE: (params) => {
    let { razorpayOrderId, priceBeforeTax ,priceAfterTax , id } = params;
    let data = [ razorpayOrderId, priceBeforeTax ,priceAfterTax, id];
    let query = `UPDATE ${ORDERS_TABLE_NAME} SET ${ORDERS_FIELDS.RAZORPAY_ORDER_ID} = ? ,  ${ORDERS_FIELDS.PRICE_BEFORE_TAX} = ? , ${ORDERS_FIELDS.PRICE_AFTER_TAX} = ? WHERE ${ORDERS_FIELDS.ID} = ?`;
    return SqlString.format(query, data);
  },

  GET_VARIANTS_DETAIL_BY_VARIANT_ID: (id) => {
    const query = ` SELECT ${VARIANTS_FIELDS.DISCOUNTED_PRICE} , ${VARIANTS_FIELDS.QTY_IN_STOCK}
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

  PAYMENT: (id, params) => {
    let { razorpayOrderId,razorPayInvoiceId,orderId,methodId,status,razorPayPaymentId,  razorPaySignature } = params;
    let query = `INSERT INTO  ${PAYMENTS_TABLE_NAME} 
    (${PAYMENTS_FIELDS.ID}, ${PAYMENTS_FIELDS.INVOICE_ID}, ${PAYMENTS_FIELDS.RAZOR_PAY_ORDER_ID}, ${PAYMENTS_FIELDS.ORDER_ID}, ${PAYMENTS_FIELDS.PAYMENT_METHOD_ID}, ${PAYMENTS_FIELDS.PAYMENT_STATUS},  ${PAYMENTS_FIELDS.RAZOR_PAY_PAYMENT_ID},   ${PAYMENTS_FIELDS.RAZOR_PAY_SIGNATURE})              
    VALUES (?,?,?,?,?,?,?,?)`;
    return SqlString.format(query, [id,razorPayInvoiceId,razorpayOrderId,orderId,methodId,status,razorPayPaymentId,  razorPaySignature]);
  },

  QUANTITY_UPDATE: (params) => {
    let {  qty , id} = params;
    let query = `UPDATE ${VARIANTS_TABLE_NAME} SET ${VARIANTS_FIELDS.QTY_IN_STOCK} = ( ${VARIANTS_FIELDS.QTY_IN_STOCK} - ? ) WHERE ${VARIANTS_FIELDS.ID} = ?`;
    return SqlString.format(query, [qty , id]);
  },

  //Orders List
  ORDER_LIST_BY_USER_ID: (id) => {
     const query = `SELECT ${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX},${ORDERS_FIELDS.CREATED_AT}  FROM  ${ORDERS_TABLE_NAME}  WHERE  ${ORDERS_FIELDS.USER_ID} =  ? ORDER BY ${ORDERS_FIELDS.CREATED_AT} DESC `;
    return SqlString.format(query, [id])
  },

  ORDER_DETAILS_BY_ID: (id) => {
    const query = `SELECT ${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX}  FROM  ${ORDERS_TABLE_NAME}  WHERE  ${ORDERS_FIELDS.ID} =  ? `;
   return SqlString.format(query, [id])
 },

 ORDER_ADDRESSID_BY_PAYMENT_ID:(id)=>{
  const query = `SELECT ${ORDERS_TABLE_NAME}.${ORDERS_FIELDS.ADDRESS_ID} 
                  FROM ${ORDERS_TABLE_NAME}
                  JOIN ${PAYMENTS_TABLE_NAME} ON ${PAYMENTS_TABLE_NAME}.${PAYMENTS_FIELDS.ORDER_ID} = ${ORDERS_TABLE_NAME}.${ORDERS_FIELDS.ID} WHERE ${PAYMENTS_TABLE_NAME}.${PAYMENTS_FIELDS.ID} = ? `;
                  return SqlString.format(query, [id])
 },

 ORDER_LIST: () => {
  const query = `SELECT ${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX}  FROM  ${ORDERS_TABLE_NAME} `;
 return SqlString.format(query, [])
},

COMPLETED_ORDER_LIST_BY_USER_ID: (id) => {
  const query = `SELECT ${ORDERS_FIELDS.ID}, ${ORDERS_FIELDS.USER_ID}, ${ORDERS_FIELDS.STATUS}, ${ORDERS_FIELDS.DELIVERY_STATUS}, ${ORDERS_FIELDS.ADDRESS_ID}, ${ORDERS_FIELDS.PRICE_BEFORE_TAX}, ${ORDERS_FIELDS.PRICE_AFTER_TAX}, ${ORDERS_FIELDS.DISCOUNT}, ${ORDERS_FIELDS.NOTES}, ${ORDERS_FIELDS.TAX}  FROM  ${ORDERS_TABLE_NAME}  WHERE  ${ORDERS_FIELDS.USER_ID} =  ? AND  ${ORDERS_FIELDS.STATUS} = "success" `;
 return SqlString.format(query, [id])
},

PAYMENT_LIST:()=>{
  const query = `SELECT * FROM ${PAYMENTS_TABLE_NAME}`;
  return SqlString.format(query)
},

ORDER_COUNT:()=>{
  const query = `SELECT COUNT(${ORDERS_FIELDS.ID}) FROM ${ORDERS_TABLE_NAME}`;
  return SqlString.format(query);
},
COMPLETED_ORDER_COUNT:()=>{
  const query =`SELECT COUNT(${ORDERS_FIELDS.DELIVERY_STATUS}) FROM ${ORDERS_TABLE_NAME} WHERE ${ORDERS_FIELDS.DELIVERY_STATUS}="Delivered"`
  return SqlString.format(query);
},

ALL_PENDING_ORDERS:()=>{
  const query =  `SELECT * FROM ${ORDERS_TABLE_NAME} WHERE ${ORDERS_FIELDS.DELIVERY_STATUS} ="processing"`;
  return SqlString.format(query);
},

WEEK_COMPLETED_ORDERS:()=>{
  const query = `
  SELECT * FROM ${ORDERS_TABLE_NAME} WHERE (DATE(${ORDERS_FIELDS.CREATED_AT}) BETWEEN NOW()-7 AND NOW()  ) `
  return SqlString.format(query)

}


};

module.exports = Orders;
