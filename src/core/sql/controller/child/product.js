
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  Product: {SCHEMA:{FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}},
  Video: {SCHEMA:{FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}},
  ProductVideo: {SCHEMA:{FIELDS: PRODUCT_VIDEO_FIELDS, TABLE_NAME: PRODUCT_VIDEO_TABLE_NAME}},
  Metadata: {SCHEMA:{FIELDS: METADATA_FIELDS, TABLE_NAME: METADATA_TABLE_NAME}},
} = require("./../../model/child");

class Product extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  /**
  * fetching for site
  * @param {*} siteId 
  */
  
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

}



const QUERY_BUILDER = {
  GET_DETAIL: (slug) => {
    const query = ` SELECT ${PRODUCT_FIELDS.ID}, ${PRODUCT_FIELDS.NAME}, ${PRODUCT_FIELDS.SLUG}, ${PRODUCT_FIELDS.DESCRIPTION}, ${PRODUCT_FIELDS.SIZE}, ${PRODUCT_FIELDS.PRICE}
    FROM ${PRODUCT_TABLE_NAME}
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
  }
  
}





module.exports = Product;
