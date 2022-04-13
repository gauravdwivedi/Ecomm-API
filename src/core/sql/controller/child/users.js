
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {Users: {FIELDS: USERS_FIELDS, TABLE_NAME: USERS_TABLE_NAME}} = require("../../model/child");

class Users extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
  * Add User
  */
   addUser(params, callback){
    this.connection.query(QUERY_BUILDER.SAVE(params), super.getQueryType('INSERT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Check User email
  */
   checkEmail(email, callback){
    this.connection.query(QUERY_BUILDER.CHECK_EMAIL(email), super.getQueryType('SELECT')).then(result => {
      callback(null, result[0])
    }).catch(error => callback(error, null));
  }
  
  /**
  * login
  */
  login(params, callback){
    this.connection.query(QUERY_BUILDER.LOGIN(params), super.getQueryType('SELECT')).then(result => {
      callback(null, result[0])
    }).catch(error => callback(error, null));
  }

  /**
  * Fetch List
  */
   fetchList(callback){
    this.connection.query(QUERY_BUILDER.FETCH_LIST(), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Fetch User Detail by ID
  */
   fetchDetailByID(userID, callback){
    this.connection.query(QUERY_BUILDER.FETCH_DETAIL_BY_ID(userID), super.getQueryType('SELECT')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Update User Detail by ID
  */
   updateDetailByID(params, callback){
    this.connection.query(QUERY_BUILDER.UPDATE_DETAIL_BY_ID(params), super.getQueryType('UPDATE')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Update User Password
  */
   changePassword(params, callback){
    this.connection.query(QUERY_BUILDER.CHANGE_PASSWORD(params), super.getQueryType('UPDATE')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }

  /**
  * Delete User
  */
   deleteUser(userID, callback){
    this.connection.query(QUERY_BUILDER.DELETE_USER_BY_ID(userID), super.getQueryType('DELETE')).then(result => {
      callback(null, result)
    }).catch(error => callback(error, null));
  }
}


const QUERY_BUILDER = {
  
  SAVE: (params) => {
    let { email, password, options } = params;
    const query = `INSERT INTO ${USERS_TABLE_NAME}
    (${USERS_FIELDS.EMAIL}, ${USERS_FIELDS.PASSWORD}, ${USERS_FIELDS.FIRST_NAME}, ${USERS_FIELDS.LAST_NAME}, ${USERS_FIELDS.IS_SUPERUSER}, ${USERS_FIELDS.EMAIL_VERIFIED}, ${USERS_FIELDS.STATUS})
    VALUES(?,?,?,?,?,?,?)
    ON DUPLICATE KEY
    UPDATE ${USERS_FIELDS.FIRST_NAME}=?`;
    return SqlString.format(query, [email, password, options[USERS_FIELDS.FIRST_NAME], options[USERS_FIELDS.LAST_NAME], 0, 0, 1, options[USERS_FIELDS.FIRST_NAME]])
  },
  CHECK_EMAIL: (email) => {
    const query = `SELECT email, password FROM ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.EMAIL} = ?`;
    return SqlString.format(query, [email])
  },
  LOGIN: (params) => {
    let {email, password} = params;
    const query = `SELECT id, email, first_name, last_name, avatar, is_superuser, email_verified, gender, dob, phone, status FROM ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.EMAIL} = ? AND ${USERS_FIELDS.PASSWORD} = ? AND ${USERS_FIELDS.STATUS} = 1`;
    return SqlString.format(query, [email, password])
  },
  FETCH_LIST: () => {
    const query = `SELECT id, email, first_name, last_name, avatar, is_superuser, email_verified, gender, dob, phone, status FROM ${USERS_TABLE_NAME}`;
    return SqlString.format(query, [])
  },
  FETCH_DETAIL_BY_ID: (userID) => {
    const query = `SELECT id, email, first_name, last_name, avatar, is_superuser, email_verified, gender, dob, phone, status FROM ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.ID} = ? AND ${USERS_FIELDS.STATUS} = 1`;
    return SqlString.format(query, [userID])
  },
  CHANGE_PASSWORD: (params) => {
    let { email, newPassword } = params;
    const query = `UPDATE ${USERS_TABLE_NAME} SET ${USERS_FIELDS.PASSWORD} = ? WHERE ${USERS_FIELDS.EMAIL} = ? AND ${USERS_FIELDS.STATUS} = 1`;
    return SqlString.format(query, [newPassword, email]);
  },
  UPDATE_DETAIL_BY_ID: (params) => {
    let { firstName, lastName, gender, dob, phone, userId } = params;
    const query = `UPDATE ${USERS_TABLE_NAME} SET ${USERS_FIELDS.FIRST_NAME} = ?, ${USERS_FIELDS.LAST_NAME} = ?, ${USERS_FIELDS.GENDER} = ?, ${USERS_FIELDS.DOB} = ?, ${USERS_FIELDS.PHONE} = ? WHERE ${USERS_FIELDS.ID} = ?`;
    return SqlString.format(query, [firstName, lastName, gender, dob, phone, userId])
  },
  DELETE_USER_BY_ID: (userId) => {
    const query = `DELETE FROM ${USERS_TABLE_NAME} WHERE ${USERS_FIELDS.ID} = ?`;
    return SqlString.format(query, [userId])
  }
}

module.exports = Users;
