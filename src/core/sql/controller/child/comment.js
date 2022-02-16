
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  Comment: {SCHEMA:{FIELDS: COMMENT_FIELDS, TABLE_NAME: COMMENT_TABLE_NAME}},
  CommentThumb: {SCHEMA:{FIELDS: COMMENT_THUMB_FIELDS, TABLE_NAME: COMMENT_THUMB_TABLE_NAME}}
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

  list(videoId, offset, limit, callback) {
    this.connection.query(QUERY_BUILDER.GET_LIST(videoId, offset, limit), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  likesUserIDs(commentIds, status, callback) {
    this.connection.query(QUERY_BUILDER.GET_LIKES_USER_IDS(commentIds, status), super.getQueryType('SELECT')).then(result => {

        let _return = new Map();
        commentIds.forEach(commentId=>{
          let likesArr = result && result.length ? result.filter(like=>like.commentId == commentId).map(likes=>likes.userId): [];
          _return.set(commentId, likesArr)
        })
        callback(null, _return)
    }).catch(error => callback(error, null));
  }
  
  /**
   * This function will could all comments for a video
   * @param {*} videoId 
   * @param {*} callback 
   */
  count(videoId, callback) {
    this.connection.query(QUERY_BUILDER.COUNT(videoId), super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0].total : 0)
    }).catch(error => callback(error, null));
  }
  
  /**
   * This function will be used to save comment in database
   * @param {*} userId 
   * @param {*} params 
   * @returns 
   */
  save (userId, params) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.SAVE(userId, params), super.getQueryType('INSERT')).then(result => {
        return resolve({result});
      }).catch(error => resolve({error}));
    })
  }
  
  /**
   * This function will delete comment form database
   * @param {*} id 
   * @returns 
   */
  delete (id){
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE(id), super.getQueryType('INSERT')).then(result => {
        return resolve(result && result[0] ? result[0] : {});
      }).catch(error => resolve({error}));
    })
  }

  like (commentId, userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.LIKE(commentId, userId), super.getQueryType('INSERT')).then(result => {
        return resolve({result});
      }).catch(error => resolve({error}));
    })
  }

  dislike (commentId, userId) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DISLIKE(commentId, userId), super.getQueryType('INSERT')).then(result => {
        return resolve({result});
      }).catch(error => resolve({error}));
    })
  }
  

}



const QUERY_BUILDER = {
  
  GET_LIST: (videoId, offset, limit) => {
    const query = ` SELECT ${COMMENT_FIELDS.ID} as commentId, ${COMMENT_FIELDS.COMMENT}, ${COMMENT_FIELDS.USER_ID}, ${COMMENT_FIELDS.VIDEO_ID}, ${COMMENT_FIELDS.CREATE_TIME}
      FROM ${COMMENT_TABLE_NAME}
      WHERE ${COMMENT_FIELDS.VIDEO_ID} = ?
      ORDER BY ${COMMENT_FIELDS.ID} desc
      limit ?,?`;
    return SqlString.format(query, [videoId, offset, limit])
  },

  GET_LIKES_USER_IDS: (commentIDs, status) =>{
    const query = ` SELECT ${COMMENT_THUMB_FIELDS.USER_ID} as userId, ${COMMENT_THUMB_FIELDS.COMMENT_ID} as commentId
    FROM ${COMMENT_THUMB_TABLE_NAME}
    WHERE ${COMMENT_THUMB_FIELDS.COMMENT_ID} IN (${commentIDs.join(',')}) AND ${COMMENT_THUMB_FIELDS.STATUS} = ?`;
  return SqlString.format(query, [status])
  },

  COUNT: (videoId) => {
    const query = ` SELECT count(${COMMENT_FIELDS.ID}) as total 
    FROM ${COMMENT_TABLE_NAME} as c
    WHERE c.${COMMENT_FIELDS.VIDEO_ID} = ?`;
    return SqlString.format(query, [videoId])
  },

  SAVE: (userId, params) => {
    const { comment, videoId } = params;
    const data = {
      [COMMENT_FIELDS.COMMENT] : comment,
      [COMMENT_FIELDS.USER_ID] : userId,
      [COMMENT_FIELDS.VIDEO_ID] : videoId
    }
    return SqlString.format(`INSERT INTO ${COMMENT_TABLE_NAME} SET ?`, data)
  },

  DELETE: (id) => {
    const query = `DELETE from ${COMMENT_TABLE_NAME} where ${COMMENT_FIELDS.ID} = ?`;
    const params = [id]
    return SqlString.format(query, params)
  },

  LIKE: (commentId, userId) =>{
    const query = `INSERT INTO \`${COMMENT_THUMB_TABLE_NAME}\`
    (${COMMENT_THUMB_FIELDS.COMMENT_ID}, ${COMMENT_THUMB_FIELDS.USER_ID}, ${COMMENT_THUMB_FIELDS.STATUS})
    VALUES(?,?,?)
    ON DUPLICATE KEY
    UPDATE ${COMMENT_THUMB_FIELDS.STATUS} = ? `;
    return SqlString.format(query, [commentId, userId, 1, 1])
  },

  DISLIKE: (commentId, userId) =>{
    const query = `INSERT INTO \`${COMMENT_THUMB_TABLE_NAME}\`
    (${COMMENT_THUMB_FIELDS.COMMENT_ID}, ${COMMENT_THUMB_FIELDS.USER_ID}, ${COMMENT_THUMB_FIELDS.STATUS})
    VALUES(?,?,?)
    ON DUPLICATE KEY
    UPDATE ${COMMENT_THUMB_FIELDS.STATUS} = ? `;
    return SqlString.format(query, [commentId, userId, 2, 2])
  }
}





module.exports = Comment;
