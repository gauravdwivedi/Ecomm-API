
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  Review: {SCHEMA:{FIELDS: REVIEW_FIELDS, TABLE_NAME: REVIEW_TABLE_NAME}},
  ProductVideo: {SCHEMA:{FIELDS: PV_FIELDS, TABLE_NAME: PV_TABLE_NAME}},
  Video: {SCHEMA:{FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}}
} = require("./../../model/child");

class Comment extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  /**
  * fetching for site
  * @param {*} siteId 
  */

  getPendingList(userId, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_PENDING_LIST(userId, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  /**
   * This function will could all comments for a video
   * @param {*} videoId 
   * @param {*} callback 
   */
  getPendingCount(userId, callback) {
    this.connection.query(QUERY_BUILDER.GET_PENDING_COUNT(userId), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0].total : 0)
    }).catch(error => callback(error, null));
  }


  /**
  * fetching for site
  * @param {*} siteId 
  */

   getReviewedList(userId, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_REVIEWED_LIST(userId, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  /**
   * This function will could all comments for a video
   * @param {*} userId 
   * @param {*} callback 
   */
  getReviewedCount(userId, callback) {
    this.connection.query(QUERY_BUILDER.GET_REVIEWED_COUNT(userId), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0].total : 0)
    }).catch(error => callback(error, null));
  }


  /**
   * This function will could all comments for a video
   * @param {*} userId 
   * @param {*} callback 
   */
   getProductReviewCount(productId, callback) {
    this.connection.query(QUERY_BUILDER.GET_PRODUCT_REVIEW_COUNT(productId), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0].total : 0)
    });
  }

  /**
  * fetching for site
  * @param {*} siteId 
  */

   getProductReviewList(productId, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_PRODUCT_REVIEW_LIST(productId, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
  
  getReviewIdFromPid(userId, pid, callback) {
    this.connection.query(QUERY_BUILDER.GET_REVIEW_FROM_PID(userId, pid), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : 0)
    }).catch(error => callback(error, null));
  }
  
  addNewReview (userId, pid) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.ADD_NEW_REVIEW(userId, pid), super.getQueryType('INSERT')).then(result => {
        return resolve(result);
      }).catch(error => resolve({error}));
    })
  }

  
  /**
   * This function will be used to save comment in database
   * @param {*} params 
   * @returns 
   */
  save (userId, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.SAVE(userId, params), super.getQueryType('UPDATE')).then(result => {
        return resolve({result});
      }).catch(error => resolve({error}));
    })
  }
  
  delete (id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE(id), super.getQueryType('UPDATE')).then(result => {
        return resolve({result});
      }).catch(error => resolve({error}));
    })
  }

}



const QUERY_BUILDER = {
  
  GET_PENDING_LIST: (userId, offset, limit) => {
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, v.${VIDEO_FIELDS.SLUG}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION}, v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster
      FROM ${REVIEW_TABLE_NAME} as R
      INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
      INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
      WHERE R.${REVIEW_FIELDS.USER_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'purchased'
      GROUP BY R.\`${REVIEW_FIELDS.ID}\`
      ORDER BY R.\`${REVIEW_FIELDS.ID}\` desc
      limit ?,?`;

    return SqlString.format(query, [userId, offset, limit])
  },

  GET_REVIEW_FROM_PID: (userId, pid) =>{
    const query = ` SELECT ${REVIEW_FIELDS.ID}
      FROM ${REVIEW_TABLE_NAME}
      WHERE ${REVIEW_FIELDS.USER_ID} = ? AND ${REVIEW_FIELDS.PRODUCT_ID} = ?`;

    return SqlString.format(query, [userId, pid])
  },

  GET_PENDING_COUNT: (userId) => {
    const query = ` SELECT count(R.${REVIEW_FIELDS.ID}) as total
    FROM ${REVIEW_TABLE_NAME} as R
    INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
    INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
    WHERE R.${REVIEW_FIELDS.USER_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'purchased'`;
    return SqlString.format(query, [userId])
  },

  GET_REVIEWED_LIST: (userId, offset, limit) => {
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, v.${VIDEO_FIELDS.SLUG}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION}, v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, R.${REVIEW_FIELDS.ATTACHMENTS}, R.${REVIEW_FIELDS.STAR}, R.${REVIEW_FIELDS.TEXT}, R.${REVIEW_FIELDS.ID} as reviewId,  R.${REVIEW_FIELDS.CREATE_TIME} as createTime
      FROM ${REVIEW_TABLE_NAME} as R
      INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
      INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
      WHERE R.${REVIEW_FIELDS.USER_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'reviewed'
      GROUP BY R.\`${REVIEW_FIELDS.ID}\`
      ORDER BY R.\`${REVIEW_FIELDS.UPDATE_TIME}\` desc
      limit ?,?`;

    return SqlString.format(query, [userId, offset, limit])
  },

  GET_PRODUCT_REVIEW_LIST: (productId, offset, limit) => {
    const query = ` SELECT v.${VIDEO_FIELDS.ID} as videoId, v.${VIDEO_FIELDS.NAME}, v.${VIDEO_FIELDS.SRT}, v.${VIDEO_FIELDS.LIKE}, v.${VIDEO_FIELDS.THUMBNAIL}, v.${VIDEO_FIELDS.SLUG}, v.${VIDEO_FIELDS.DESCRIPTION}, v.${VIDEO_FIELDS.DURATION}, v.${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL} as hlsUrl, v.${VIDEO_FIELDS.POSTER} as poster, R.${REVIEW_FIELDS.ATTACHMENTS}, R.${REVIEW_FIELDS.STAR}, R.${REVIEW_FIELDS.TEXT}, R.${REVIEW_FIELDS.ID} as reviewId,  R.${REVIEW_FIELDS.CREATE_TIME} as createTime
      FROM ${REVIEW_TABLE_NAME} as R
      INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
      INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
      WHERE R.${REVIEW_FIELDS.PRODUCT_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'reviewed'
      GROUP BY R.\`${REVIEW_FIELDS.ID}\`
      ORDER BY R.\`${REVIEW_FIELDS.ID}\` desc
      limit ?,?`;

    return SqlString.format(query, [productId, offset, limit])
  },


  GET_REVIEWED_COUNT: (userId) => {
    const query = ` SELECT count(R.${REVIEW_FIELDS.ID}) as total
    FROM ${REVIEW_TABLE_NAME} as R
    INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
    INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
    WHERE R.${REVIEW_FIELDS.USER_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'reviewed'`;
    return SqlString.format(query, [userId])
  },

  GET_PRODUCT_REVIEW_COUNT: (productId) => {
    const query = ` SELECT count(R.${REVIEW_FIELDS.ID}) as total
    FROM ${REVIEW_TABLE_NAME} as R
    INNER JOIN ${PV_TABLE_NAME} as PV on PV.${PV_FIELDS.PRODUCT_ID} = R.${REVIEW_FIELDS.PRODUCT_ID}
    INNER JOIN ${VIDEO_TABLE_NAME} as v on v.${VIDEO_FIELDS.ID} = PV.${PV_FIELDS.VIDEO_ID}
    WHERE R.${REVIEW_FIELDS.PRODUCT_ID} = ? AND R.${REVIEW_FIELDS.STATUS} = 'reviewed'`;
    return SqlString.format(query, [productId])
  },

  ADD_NEW_REVIEW: (userId, pid) => {
    const data = {
      [REVIEW_FIELDS.PRODUCT_ID] : pid,
      [REVIEW_FIELDS.USER_ID] : userId,
      [REVIEW_FIELDS.STAR]: 0,
      [REVIEW_FIELDS.STATUS] : 'purchased'
    }
    return SqlString.format(`INSERT INTO ${REVIEW_TABLE_NAME} SET ?`, data)
  },

  SAVE: (userId, params) => {
    const { text, star, attachments, productId } = params;
    const query = `UPDATE ${REVIEW_TABLE_NAME} 
      SET ${REVIEW_FIELDS.TEXT} = ? ,
      ${REVIEW_FIELDS.STAR} = ? ,
      ${REVIEW_FIELDS.ATTACHMENTS} = ? ,
      ${REVIEW_FIELDS.STATUS} = 'reviewed' 
      WHERE ${REVIEW_FIELDS.PRODUCT_ID} = ? AND ${REVIEW_FIELDS.USER_ID} = ?`;
    
    const queryParams = [text, star, attachments, productId, userId];
    return SqlString.format(query, queryParams)
  },

  DELETE: (id) => {
    const query = `UPDATE ${REVIEW_TABLE_NAME} 
      SET ${REVIEW_FIELDS.TEXT} = '' ,
      ${REVIEW_FIELDS.STAR} = 0 ,
      ${REVIEW_FIELDS.ATTACHMENTS} = '' ,
      ${REVIEW_FIELDS.STATUS} = 'purchased' 
      WHERE ${REVIEW_FIELDS.ID} = ?`;
    
    const params = [id];

    return SqlString.format(query, params)
  },
}





module.exports = Comment;
