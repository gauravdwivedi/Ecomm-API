const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {
  Cart: { SCHEMA: { FIELDS: CART_FIELDS, TABLE_NAME: CART_TABLE_NAME }},
  Product: { SCHEMA: { FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME }},
  Variants: { SCHEMA: { FIELDS: VARIANT_FIELDS, TABLE_NAME: VARIANT_TABLE_NAME }},
  ProductImages: { SCHEMA: { FIELDS: PRODUCT_IMAGE_FIELDS, TABLE_NAME: PRODUCT_IMAGE_TABLE_NAME }},
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

  /**
   * List Cart Products
   */
   listCart(userId) {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.LIST_CART(userId), super.getQueryType("SELECT"))
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

  LIST_CART: (userId) => {
    const query = `SELECT DISTINCT c.${CART_FIELDS.ID}, c.${CART_FIELDS.QUANTITY} as quanity, p.${PRODUCT_FIELDS.ID} as productId, p.${PRODUCT_FIELDS.TITLE} as title, p.${PRODUCT_FIELDS.SLUG} as slug, v.${VARIANT_FIELDS.COLOR}, v.${VARIANT_FIELDS.SIZE}, v.${VARIANT_FIELDS.SKU}, v.${VARIANT_FIELDS.PRICE}, v.${VARIANT_FIELDS.DISCOUNTED_PRICE}
    FROM ${CART_TABLE_NAME} AS c
    LEFT JOIN ${PRODUCT_TABLE_NAME} AS p ON p.${PRODUCT_FIELDS.ID} = c.${CART_FIELDS.PRODUCT_ID}
    LEFT JOIN ${VARIANT_TABLE_NAME} AS v ON v.${VARIANT_FIELDS.ID} = c.${CART_FIELDS.VARIANT_ID}
    WHERE c.${CART_FIELDS.USER_ID} = ?`;
    return SqlString.format(query, [userId]);
  }
};

module.exports = Cart;
