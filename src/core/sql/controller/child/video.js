
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  MenuVideo: {SCHEMA:{FIELDS: MENU_VIDEO_FIELDS, TABLE_NAME: MENU_VIDEO_TABLE_NAME}},
  Video: {SCHEMA:{FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}},
  Metadata: {SCHEMA:{FIELDS: METADATA_FIELDS, TABLE_NAME: METADATA_TABLE_NAME}},
  LikeVideo: {SCHEMA:{FIELDS: LIKED_VIDEO_FIELDS, TABLE_NAME: LIKE_VIDEO_TABLE_NAME}},
  ProductVideo: {SCHEMA:{FIELDS: PRODUCT_VIDEO_FIELDS, TABLE_NAME: PRODUCT_VIDEO_TABLE_NAME}},
  Product: {SCHEMA:{FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}},
  
} = require("./../../model/child");

class Video extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  /**
  * fetching for site
  * @param {*} siteId 
  */
  list(menuId, offset, limit, videoSlug, callback){
    this.connection.query(QUERY_BUILDER.GET_LIST(menuId, offset, limit, videoSlug), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  getFirstVideo(videoSlug, menuId, callback){
    this.connection.query(QUERY_BUILDER.GET_FIRST_VIDEO(videoSlug, menuId), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  shortList(menuId, callback){
    this.connection.query(QUERY_BUILDER.GET_SHORT_LIST(menuId), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  
  sitemapVideoIDs(menuIDs, callback){
    this.connection.query(QUERY_BUILDER.GET_SITEMAP_VIDEO_IDS(menuIDs), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  sitemapVideoList(videoIDs, callback){
    this.connection.query(QUERY_BUILDER.GET_SITEMAP_SHORT_LIST(videoIDs), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  /**
  * This function will return products of a video
  * @param {*} videoIDs 
  * @param {*} callback 
  */
  getProducts(videoIDs, callback){
    this.connection.query(QUERY_BUILDER.GET_PRODUCTS(videoIDs), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  /**
  * This function will return count of all videos within the database
  * @param {*} menuId 
  * @param {*} callback 
  */
  count(menuId, callback) {
    this.connection.query(QUERY_BUILDER.COUNT(menuId), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0].total : 0)
    }).catch(error => callback(error, null));
  }
  
  /**
  * This function will be used when users will like any video
  * @param {*} userId 
  * @param {*} videoId 
  * @param {*} callback 
  */
  like(videoId, callback) {
    this.connection.query(QUERY_BUILDER.LIKE(videoId), super.getQueryType('UPDATE')).then(result => {
      callback(null, result)
    }).catch(error =>  {
      callback(error, null)
    });
  }
  
  
  /**
  * This function will be used when users will dislike any video
  * @param {*} userId 
  * @param {*} videoId 
  * @param {*} callback 
  */
  dislike(videoId, callback) {
    this.connection.query(QUERY_BUILDER.DISLIKE(videoId), super.getQueryType('UPDATE')).then(result => {
      callback(null, result)
    }).catch(error =>  callback(error, null));
  }
  
}



const QUERY_BUILDER = {
  
  GET_LIST: (menuId, offset, limit, videoSlug) => {
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, 
    v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, 
    v.${VIDEO_FIELDS.SLUG}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION},
    v.${VIDEO_FIELDS.CAPTION_URL},
    v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, M.*
    FROM ${VIDEO_TABLE_NAME} as v
    LEFT JOIN ${MENU_VIDEO_TABLE_NAME} as MV on MV.${MENU_VIDEO_FIELDS.VIDEO_ID} = v.${VIDEO_FIELDS.ID}
    LEFT JOIN ${METADATA_TABLE_NAME} as M on M.${METADATA_FIELDS.ENTITY_ID} = v.${VIDEO_FIELDS.ID} AND M.${METADATA_FIELDS.ENTITY_TYPE} = 'video'
    WHERE MV.${MENU_VIDEO_FIELDS.MENU_ID} = ?
    AND v.${VIDEO_FIELDS.SLUG} != ?
    ORDER BY MV.\`${MENU_VIDEO_FIELDS.ORDER}\` asc
    limit ?,?`;
    return SqlString.format(query, [menuId, videoSlug, offset, limit])
  },

  GET_FIRST_VIDEO: (videoSlug, menuId) =>{
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, 
    v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, 
    v.${VIDEO_FIELDS.SLUG}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION},
    v.${VIDEO_FIELDS.CAPTION_URL},
    v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, M.*
    FROM ${VIDEO_TABLE_NAME} as v
    LEFT JOIN ${MENU_VIDEO_TABLE_NAME} as MV on MV.${MENU_VIDEO_FIELDS.VIDEO_ID} = v.${VIDEO_FIELDS.ID}
    LEFT JOIN ${METADATA_TABLE_NAME} as M on M.${METADATA_FIELDS.ENTITY_ID} = v.${VIDEO_FIELDS.ID} AND M.${METADATA_FIELDS.ENTITY_TYPE} = 'video'
    WHERE v.${VIDEO_FIELDS.SLUG} = ? AND MV.${MENU_VIDEO_FIELDS.MENU_ID} = ?`;
    return SqlString.format(query, [videoSlug, menuId])
  },
  
  GET_SHORT_LIST: (menuId) => {
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.THUMBNAIL} as thumbnail, v.${VIDEO_FIELDS.POSTER} as poster, v.${VIDEO_FIELDS.SLUG}
    FROM ${VIDEO_TABLE_NAME} as v
    LEFT JOIN ${MENU_VIDEO_TABLE_NAME} as MV on MV.${MENU_VIDEO_FIELDS.VIDEO_ID} = v.${VIDEO_FIELDS.ID}
    WHERE MV.${MENU_VIDEO_FIELDS.MENU_ID} = ?
    ORDER BY MV.\`${MENU_VIDEO_FIELDS.ORDER}\` asc
    limit 0,5`;
    return SqlString.format(query, [menuId])
  },

  GET_SITEMAP_SHORT_LIST: (videoIDs) => {
    const query = ` SELECT ${VIDEO_FIELDS.ID} as videoId, ${VIDEO_FIELDS.NAME}, ${VIDEO_FIELDS.THUMBNAIL} as thumbnail, ${VIDEO_FIELDS.POSTER} as poster, ${VIDEO_FIELDS.SLUG}, ${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as videoPath, ${VIDEO_FIELDS.CREATE_TIME} as createdAt
    FROM ${VIDEO_TABLE_NAME}
    WHERE ${VIDEO_FIELDS.ID} IN (${videoIDs.join(',')})
    `;
    return SqlString.format(query, [])
  },

  GET_SITEMAP_VIDEO_IDS: (menuIDs) => {
    const query = ` SELECT ${MENU_VIDEO_FIELDS.VIDEO_ID} as videoId, ${MENU_VIDEO_FIELDS.MENU_ID} as menuId
    FROM ${MENU_VIDEO_TABLE_NAME}
    WHERE ${MENU_VIDEO_FIELDS.MENU_ID} IN (${menuIDs.join(',')})
    ORDER BY \`${MENU_VIDEO_FIELDS.ORDER}\` asc`;
    return SqlString.format(query, [])
  },
  
  GET_PRODUCTS: (videoIDs) =>{
    
    const query = ` SELECT P.${PRODUCT_FIELDS.ID}, P.${PRODUCT_FIELDS.NAME}, P.${PRODUCT_FIELDS.DESCRIPTION}, P.${PRODUCT_FIELDS.SIZE}, P.${PRODUCT_FIELDS.PRICE}, P.${PRODUCT_FIELDS.IMAGES}, P.${PRODUCT_FIELDS.MOBILE_IMAGES}, P.${PRODUCT_FIELDS.SHOPIFY_PRODUCT_ID}, P.${PRODUCT_FIELDS.DETAIL}, P.${PRODUCT_FIELDS.MORE}, P.${PRODUCT_FIELDS.SLUG}, PV.${PRODUCT_VIDEO_FIELDS.VIDEO_ID}
    FROM ${PRODUCT_VIDEO_TABLE_NAME} as PV
    LEFT JOIN ${PRODUCT_TABLE_NAME} as P on P.${PRODUCT_FIELDS.ID} = PV.${PRODUCT_VIDEO_FIELDS.PRODUCT_ID}
    WHERE PV.${PRODUCT_VIDEO_FIELDS.VIDEO_ID} IN (${videoIDs.join(',')})
    ORDER BY PV.\`${PRODUCT_VIDEO_FIELDS.ORDER}\` asc
    `;
    return SqlString.format(query, [])
  },
  
  COUNT: (menuId) => {
    const query = ` SELECT count(v.${VIDEO_FIELDS.ID}) as total 
    FROM ${VIDEO_TABLE_NAME} as v
    LEFT JOIN ${MENU_VIDEO_TABLE_NAME} as MV on MV.${MENU_VIDEO_FIELDS.VIDEO_ID} = v.${VIDEO_FIELDS.ID}
    WHERE MV.${MENU_VIDEO_FIELDS.MENU_ID} = ? `;
    
    return SqlString.format(query, [menuId])
  },
  
  LIKE: (videoId) => {
    const query = `UPDATE ${VIDEO_TABLE_NAME} SET \`${VIDEO_FIELDS.LIKE}\` = \`${VIDEO_FIELDS.LIKE}\`+1 WHERE ${VIDEO_FIELDS.ID} = ?`;
    
    return SqlString.format(query, [videoId])
  },
  
  DISLIKE: (videoId) => {
    const query = `UPDATE ${VIDEO_TABLE_NAME} SET \`${VIDEO_FIELDS.LIKE}\` = \`${VIDEO_FIELDS.LIKE}\`-1 WHERE ${VIDEO_FIELDS.ID} = ?`;
    
    return SqlString.format(query, [videoId])
  }
  
}





module.exports = Video;
