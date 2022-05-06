
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  Product: {SCHEMA:{FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}},
  ProductVideos: {SCHEMA:{FIELDS: PRODUCT_VIDEOS_FIELDS, TABLE_NAME: PRODUCT_VIDEOS_TABLE_NAME}},
  ProductImages: {SCHEMA:{FIELDS: PRODUCT_IMAGES_FIELDS, TABLE_NAME: PRODUCT_IMAGES_TABLE_NAME}},
  Variants: {SCHEMA:{FIELDS: VARIANTS_FIELDS, TABLE_NAME: VARIANTS_TABLE_NAME}},
} = require("./../../model/child");

class Product extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  /**
  * adding new product
  * @param {*} name 
  */

  saveProduct(title, description, category, rating, slug) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.SAVE_PRODUCT(title, description, category, rating, slug), super.getQueryType('INSERT')).then(result => {
        resolve(result);
      }).catch(error => resolve(error));
    })
  }
  
  list(sort_by, order, min_price, max_price, category_id, size, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_LIST(sort_by, order, min_price, max_price, category_id, size, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  productDetailBySlug(slug) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_DETAIL_BY_SLUG(slug), super.getQueryType('SELECT')).then(result => {
        resolve(result[0])
      }).catch(error => resolve({}));
    })
  }
  
  productDetailById(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_DETAIL_BY_ID(id), super.getQueryType('SELECT')).then(result => {
        resolve(result[0])
      }).catch(error => resolve({}));
    })
  }

  updateProduct = (product_id, params) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.UPDATE_PRODUCT(product_id, params), super.getQueryType('UPDATE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  deleteProduct = (product_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT(product_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }
}



const QUERY_BUILDER = {
  SAVE_PRODUCT: (title, description, category, rating, slug) => {
    const data = {
      [PRODUCT_FIELDS.TITLE] : title,
      [PRODUCT_FIELDS.DESCRIPTION] : description,
      [PRODUCT_FIELDS.CATEGORY] : category,
      [PRODUCT_FIELDS.RATING] : rating,
      [PRODUCT_FIELDS.SLUG] : slug,
      [PRODUCT_FIELDS.STATUS]:1
    }
    return SqlString.format(`INSERT INTO ${PRODUCT_TABLE_NAME} SET ?`, data)
  },

  GET_LIST: (sort_by, order, min_price, max_price, category_id, size, offset, limit) => {
    let myQuery = `p.${PRODUCT_FIELDS.STATUS} = 1`;
    myQuery += category_id ? ` AND p.${PRODUCT_FIELDS.CATEGORY} = ${category_id}`: '';
    myQuery += min_price ? ` AND v.${VARIANTS_FIELDS.PRICE} >= ${min_price}` : '';
    myQuery += max_price ? ` AND v.${VARIANTS_FIELDS.PRICE} <= ${max_price}` : '';
    myQuery += size ? ` AND v.${VARIANTS_FIELDS.SIZE} = \'${size}\'` : '';
    const query = ` SELECT DISTINCT p.${PRODUCT_FIELDS.ID}, p.${PRODUCT_FIELDS.CATEGORY}, p.${PRODUCT_FIELDS.TITLE}, p.${PRODUCT_FIELDS.DESCRIPTION}, p.${PRODUCT_FIELDS.RATING}, p.${PRODUCT_FIELDS.SLUG} 
      FROM ${PRODUCT_TABLE_NAME} as p
      INNER JOIN ${VARIANTS_TABLE_NAME} as v ON v.${VARIANTS_FIELDS.PRODUCT_ID} = p.${PRODUCT_FIELDS.ID}
      WHERE ${myQuery}
      ORDER BY ${sort_by} ${order}
      limit ?,?`;
    return SqlString.format(query, [offset, limit])
  },

  GET_PRODUCT_DETAIL_BY_SLUG: (slug) => {
    const query = ` SELECT ${PRODUCT_FIELDS.ID}, ${PRODUCT_FIELDS.CATEGORY}, ${PRODUCT_FIELDS.TITLE}, ${PRODUCT_FIELDS.DESCRIPTION}, ${PRODUCT_FIELDS.RATING}, ${PRODUCT_FIELDS.SLUG} 
      FROM ${PRODUCT_TABLE_NAME}
      WHERE ${PRODUCT_FIELDS.SLUG} = ?`;
    return SqlString.format(query, [slug])
  },

  GET_PRODUCT_DETAIL_BY_ID: (id) => {
    const query = ` SELECT ${PRODUCT_FIELDS.ID}, ${PRODUCT_FIELDS.CATEGORY}, ${PRODUCT_FIELDS.TITLE}, ${PRODUCT_FIELDS.DESCRIPTION}, ${PRODUCT_FIELDS.RATING}, ${PRODUCT_FIELDS.SLUG} 
      FROM ${PRODUCT_TABLE_NAME}
      WHERE ${PRODUCT_FIELDS.ID} = ?`;
    return SqlString.format(query, [id])
  },

  UPDATE_PRODUCT: (productId, params) => {
    const { title, category, rating, slug } = params;
    const query = `UPDATE ${PRODUCT_TABLE_NAME} 
      SET ${PRODUCT_FIELDS.TITLE} = ? ,
      ${PRODUCT_FIELDS.CATEGORY} = ? ,
      ${PRODUCT_FIELDS.RATING} = ? ,
      ${PRODUCT_FIELDS.SLUG} = ? 
      WHERE ${PRODUCT_FIELDS.ID} = ?`;
    
    const queryParams = [title, category, rating, slug, productId];
    return SqlString.format(query, queryParams)
  },

  DELETE_PRODUCT: (id) => {
    const query = `DELETE FROM ${PRODUCT_TABLE_NAME} WHERE ${PRODUCT_FIELDS.ID} = ${id}`;
    return SqlString.format(query, [])
  }
}





module.exports = Product;
