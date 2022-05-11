const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {
  Cart: { SCHEMA: { FIELDS: CART_FIELDS, TABLE_NAME: CART_TABLE_NAME }},
} = require("./../../model/child");

class Cart extends AbstractSQL {
  constructor(siteId) {
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
   * Add to Cart
   */
  addToCart(params) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.ADD_TO_CART(params), super.getQueryType("INSERT"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

  /**
   * Remove from Cart
   */
   removeFromCart(id) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.REMOVE_FROM_CART(id), super.getQueryType("DELETE"))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => reject(error));
    })
  }

}

const QUERY_BUILDER = {
  ADD_TO_CART: (params) => {
    let { userId, productId, variantId, quantity } = params;
    const query = `INSERT INTO ${CART_TABLE_NAME}
    (${CART_FIELDS.USER_ID}, ${CART_FIELDS.PRODUCT_ID} , ${CART_FIELDS.VARIANT_ID}, ${CART_FIELDS.QUANTITY}, ${CART_FIELDS.STATUS})
    VALUES(?,?,?,?,1)
    ON DUPLICATE KEY
    UPDATE ${CART_FIELDS.QUANTITY}=?`;
    return SqlString.format(query, [userId, productId, variantId, quantity, quantity]);
  },

  REMOVE_FROM_CART: (id) => {
    const query = `DELETE FROM ${CART_TABLE_NAME} WHERE ${CART_FIELDS.ID} = ?`;
    return SqlString.format(query, [id]);
  },
};

module.exports = Cart;
