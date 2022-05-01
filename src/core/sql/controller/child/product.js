
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  Product: {SCHEMA:{FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}},
  Video: {SCHEMA:{FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}},
  ProductVideo: {SCHEMA:{FIELDS: PRODUCT_VIDEO_FIELDS, TABLE_NAME: PRODUCT_VIDEO_TABLE_NAME}},
  Metadata: {SCHEMA:{FIELDS: METADATA_FIELDS, TABLE_NAME: METADATA_TABLE_NAME}},
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

  saveProduct(title, description, category, video_url, rating, slug) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.SAVE_PRODUCT(title, description, category, video_url, rating, slug), super.getQueryType('INSERT')).then(result => {
        resolve(result);
      }).catch(error => resolve(error));
    })
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

  saveProductImages(productId, images) {
    return new Promise((resolve, reject) => {
      let a = [];
      images.map(image => {
        this.connection.query(QUERY_BUILDER.SAVE_PRODUCT_IMAGES(productId, image), super.getQueryType('INSERT')).then(result => {
          a.push(result && result[0] ? result[0] : "");
        }).catch(error => console.log(error));
      })
      resolve(a);
    })
  }
  
  list(sort_by, order, min_price, max_price, category_id, size, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_LIST(sort_by, order, min_price, max_price, category_id, size, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  getProductVariants = (product_id, size, color, min_price, max_price) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_VARIANTS(product_id, size, color, min_price, max_price), super.getQueryType('SELECT')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  getProductImages(product_id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_IMAGES(product_id), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }
  
  detail(slug, callback) {
    this.connection.query(QUERY_BUILDER.GET_DETAIL(slug), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => {
      return callback(error, null)
    });
  }

  productVideo(pid, callback) {
    this.connection.query(QUERY_BUILDER.GET_PRODUCT_VIDEO(pid), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0]: {})
    }).catch(error => {
      return callback(error, null)
    });
  }
  
  videoDetail(slug, callback) {
    this.connection.query(QUERY_BUILDER.GET_VIDEO_DETAIL(slug), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : {})
    }).catch(error => {
      return callback(error, null)
    });
  }
  
  productDetail(slug, callback) {
    this.connection.query(QUERY_BUILDER.GET_VIDEO_DETAIL(slug), super.getQueryType('SELECT')).then(result => {
      callback(null, result || [])
    });
  }

  getProductIdFromShopify(pid, callback){
    this.connection.query(QUERY_BUILDER.GET_PRODUCT_ID_SHOPIFY(pid), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : {})
    }).catch(error => {
      return callback(error, null)
    });
  }

  updateProduct = (product_id, params) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.UPDATE_PRODUCT(product_id, params), super.getQueryType('UPDATE')).then(result => {
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

  deleteProductImage = (image_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_IMAGE(image_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

}



const QUERY_BUILDER = {
  SAVE_PRODUCT: (title, description, category, video_url, rating, slug) => {
    const data = {
      [PRODUCT_FIELDS.TITLE] : title,
      [PRODUCT_FIELDS.DESCRIPTION] : description,
      [PRODUCT_FIELDS.CATEGORY] : category,
      [PRODUCT_FIELDS.VIDEO_URL] : video_url,
      [PRODUCT_FIELDS.RATING] : rating,
      [PRODUCT_FIELDS.SLUG] : slug,
      [PRODUCT_FIELDS.STATUS]:1
    }
    return SqlString.format(`INSERT INTO ${PRODUCT_TABLE_NAME} SET ?`, data)
  },

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
    return SqlString.format(`INSERT INTO ${VARIANTS_TABLE_NAME} SET ?`, data)
  },

  SAVE_PRODUCT_IMAGES: (product_id, url) => {
    const data = {
      [PRODUCT_IMAGES_FIELDS.PRODUCT_ID] : product_id,
      [PRODUCT_IMAGES_FIELDS.URL] : url,
      [PRODUCT_IMAGES_FIELDS.STATUS] : 1,
    }
    return SqlString.format(`INSERT INTO ${PRODUCT_IMAGES_TABLE_NAME} SET ?`, data)
  },

  GET_LIST: (sort_by, order, min_price, max_price, category_id, size, offset, limit) => {
    let myQuery = `p.${PRODUCT_FIELDS.STATUS} = 1`;
    myQuery += category_id ? ` AND p.${PRODUCT_FIELDS.CATEGORY} = ${category_id}`: '';
    myQuery += min_price ? ` AND v.${VARIANTS_FIELDS.PRICE} >= ${min_price}` : '';
    myQuery += max_price ? ` AND v.${VARIANTS_FIELDS.PRICE} <= ${max_price}` : '';
    myQuery += size ? ` AND v.${VARIANTS_FIELDS.SIZE} = \'${size}\'` : '';
    const query = ` SELECT DISTINCT p.${PRODUCT_FIELDS.ID}, p.${PRODUCT_FIELDS.CATEGORY}, p.${PRODUCT_FIELDS.VIDEO_URL}, p.${PRODUCT_FIELDS.TITLE}, p.${PRODUCT_FIELDS.RATING}, p.${PRODUCT_FIELDS.SLUG} 
      FROM ${PRODUCT_TABLE_NAME} as p
      INNER JOIN ${VARIANTS_TABLE_NAME} as v ON v.${VARIANTS_FIELDS.PRODUCT_ID} = p.${PRODUCT_FIELDS.ID}
      WHERE ${myQuery}
      ORDER BY ${sort_by} ${order}
      limit ?,?`;
    return SqlString.format(query, [offset, limit])
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

  GET_PRODUCT_IMAGES: (product_id) => {
    const query = ` SELECT ${PRODUCT_IMAGES_FIELDS.URL}
      FROM ${PRODUCT_IMAGES_TABLE_NAME}
      WHERE ${PRODUCT_IMAGES_FIELDS.PRODUCT_ID} = ${product_id}`;
    return SqlString.format(query, [])
  },

  GET_DETAIL: (slug) => {
    // const query = ` SELECT ${PRODUCT_FIELDS.ID}, ${PRODUCT_FIELDS.NAME}, ${PRODUCT_FIELDS.SLUG}, ${PRODUCT_FIELDS.DESCRIPTION}, ${PRODUCT_FIELDS.SIZE}, ${PRODUCT_FIELDS.PRICE}
    // FROM ${PRODUCT_TABLE_NAME}
    // WHERE ${PRODUCT_FIELDS.SLUG} = ?`;
    const query = ` SELECT * FROM ${PRODUCT_TABLE_NAME}
    WHERE ${PRODUCT_FIELDS.SLUG} = ?`;
    return SqlString.format(query, [slug])
  },

  GET_PRODUCT_VIDEO: (pid) => {
    const query = ` SELECT v.${VIDEO_FIELDS.SLUG} as videoSlug
    FROM ${PRODUCT_VIDEO_TABLE_NAME} as PV
    INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.VIDEO_ID}
    WHERE PV.${PRODUCT_VIDEO_FIELDS.PRODUCT_ID} = ? and PV.${PRODUCT_VIDEO_FIELDS.IS_INTRO} = 1`;
    return SqlString.format(query, [pid])
  },
  

  GET_PRODUCT_ID_SHOPIFY: (pid) =>{
    const query = ` SELECT ${PRODUCT_FIELDS.ID}
    FROM ${PRODUCT_TABLE_NAME}
    WHERE ${PRODUCT_FIELDS.SHOPIFY_PRODUCT_ID} = ?`;
    return SqlString.format(query, [pid])
  },
  
  GET_VIDEO_DETAIL: (slug) => {
    const query = ` SELECT P.${PRODUCT_FIELDS.ID} as productId, P.${PRODUCT_FIELDS.NAME} as productName, P.${PRODUCT_FIELDS.DESCRIPTION}, P.${PRODUCT_FIELDS.SIZE}, P.${PRODUCT_FIELDS.PRICE}, P.${PRODUCT_FIELDS.IMAGES}, P.${PRODUCT_FIELDS.MOBILE_IMAGES}, P.${PRODUCT_FIELDS.SHOPIFY_PRODUCT_ID}, P.${PRODUCT_FIELDS.DETAIL}, P.${PRODUCT_FIELDS.MORE}, P.${PRODUCT_FIELDS.SLUG}, v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION}, v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, md.*
    FROM ${PRODUCT_TABLE_NAME} as P
    LEFT JOIN ${PRODUCT_VIDEO_TABLE_NAME} as PV on P.${PRODUCT_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.PRODUCT_ID}
    LEFT JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.VIDEO_ID}
    LEFT JOIN ${METADATA_TABLE_NAME} as md on md.${METADATA_FIELDS.ENTITY_ID} = v.${VIDEO_FIELDS.ID} AND md.${METADATA_FIELDS.ENTITY_TYPE} = 'video'
    WHERE P.${PRODUCT_FIELDS.SLUG} = ? AND v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} IS NOT NULL AND m.${MENU_FIELDS.SHOWN} = 1`;
    return SqlString.format(query, [slug])
  },
  
  GET_VIDEO_DETAIL: (slug) => {
    const query = ` SELECT P.${PRODUCT_FIELDS.ID} as productId, P.${PRODUCT_FIELDS.NAME} as productName, 
    P.${PRODUCT_FIELDS.DESCRIPTION}, P.${PRODUCT_FIELDS.SIZE}, P.${PRODUCT_FIELDS.PRICE}, 
    P.${PRODUCT_FIELDS.IMAGES}, P.${PRODUCT_FIELDS.MOBILE_IMAGES}, P.${PRODUCT_FIELDS.SHOPIFY_PRODUCT_ID}, 
    P.${PRODUCT_FIELDS.DETAIL}, P.${PRODUCT_FIELDS.MORE}, P.${PRODUCT_FIELDS.SLUG}, 
    v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, 
    v.${VIDEO_FIELDS.THUMBNAIL}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION},
    v.${VIDEO_FIELDS.SLUG} AS video_slug, 
    v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, md.*
    FROM ${PRODUCT_TABLE_NAME} as P
    LEFT JOIN ${PRODUCT_VIDEO_TABLE_NAME} as PV on P.${PRODUCT_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.PRODUCT_ID}
    LEFT JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.VIDEO_ID}
   LEFT JOIN ${METADATA_TABLE_NAME} as md on md.${METADATA_FIELDS.ENTITY_ID} = v.${VIDEO_FIELDS.ID} AND md.${METADATA_FIELDS.ENTITY_TYPE} = 'video'
    WHERE P.${PRODUCT_FIELDS.SLUG} = ? AND v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} IS NOT NULL`;
    return SqlString.format(query, [slug])
  },

  UPDATE_PRODUCT: (productId, params) => {
    const { title, category, video_url, rating, slug } = params;
    const query = `UPDATE ${PRODUCT_TABLE_NAME} 
      SET ${PRODUCT_FIELDS.TITLE} = ? ,
      ${PRODUCT_FIELDS.CATEGORY} = ? ,
      ${PRODUCT_FIELDS.VIDEO_URL} = ? ,
      ${PRODUCT_FIELDS.RATING} = ? ,
      ${PRODUCT_FIELDS.SLUG} = ? 
      WHERE ${PRODUCT_FIELDS.ID} = ?`;
    
    const queryParams = [title, category, video_url, rating, slug, productId];
    return SqlString.format(query, queryParams)
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

  DELETE_PRODUCT_IMAGE: (imageId) => {
    const query = `DELETE FROM ${PRODUCT_IMAGES_TABLE_NAME}
      WHERE ${PRODUCT_IMAGES_FIELDS.ID} = ?`;
    
    const queryParams = [imageId];
    return SqlString.format(query, queryParams)
  },
  
  
}





module.exports = Product;
