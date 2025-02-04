
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {v4 : uuidv4} = require('uuid')
const {
  ProductVideos: {SCHEMA:{FIELDS: PRODUCT_VIDEOS_FIELDS, TABLE_NAME: PRODUCT_VIDEOS_TABLE_NAME}},
} = require("../../model/child");

class ProductVideos extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  saveProductVideo(productId, video) {
    let id = uuidv4();
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.SAVE_PRODUCT_VIDEO(id, productId, video), super.getQueryType('INSERT')).then(result => {
        resolve(id);
      }).catch(error => reject(error));
    })
  }

  getProductVideos(product_id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_VIDEOS(product_id), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }

  deleteProductVideo = (video_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_VIDEO(video_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  deleteProductVideosByProductId = (product_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_VIDEOS_BY_PRODUCT_ID(product_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }
}



const QUERY_BUILDER = {
  SAVE_PRODUCT_VIDEO: (id, product_id, video) => {
    const data = {
      [PRODUCT_VIDEOS_FIELDS.ID] : id,
      [PRODUCT_VIDEOS_FIELDS.PRODUCT_ID] : product_id,
      [PRODUCT_VIDEOS_FIELDS.URL] : video?.url,
      [PRODUCT_VIDEOS_FIELDS.NAME] : video?.name || '',
      [PRODUCT_VIDEOS_FIELDS.THUMBNAIL] : video?.thumbnail || '',
      [PRODUCT_VIDEOS_FIELDS.DESCRIPTION] : video?.description || '',
      [PRODUCT_VIDEOS_FIELDS.SLUG] : video?.slug
    }
    return SqlString.format(`INSERT INTO ${PRODUCT_VIDEOS_TABLE_NAME} SET ?`, data)
  },

  GET_PRODUCT_VIDEOS: (product_id) => {
    const query = ` SELECT ${PRODUCT_VIDEOS_FIELDS.URL}, ${PRODUCT_VIDEOS_FIELDS.NAME}, ${PRODUCT_VIDEOS_FIELDS.SLUG}, ${PRODUCT_VIDEOS_FIELDS.THUMBNAIL}, ${PRODUCT_VIDEOS_FIELDS.DESCRIPTION}, ${PRODUCT_VIDEOS_FIELDS.ID}
      FROM ${PRODUCT_VIDEOS_TABLE_NAME}
      WHERE ${PRODUCT_VIDEOS_FIELDS.PRODUCT_ID} = ?`;
    return SqlString.format(query, [product_id])
  },

  DELETE_PRODUCT_VIDEO: (videoId) => {
    const query = `DELETE FROM ${PRODUCT_VIDEOS_TABLE_NAME}
      WHERE ${PRODUCT_VIDEOS_FIELDS.ID} = ?`;
    
    const queryParams = [videoId];
    return SqlString.format(query, queryParams)
  },

  DELETE_PRODUCT_VIDEOS_BY_PRODUCT_ID: (id) => {
    const query = `DELETE FROM ${PRODUCT_VIDEOS_TABLE_NAME} WHERE ${PRODUCT_VIDEOS_FIELDS.PRODUCT_ID} = ?`;
    return SqlString.format(query, [id])
  }
}

module.exports = ProductVideos;
