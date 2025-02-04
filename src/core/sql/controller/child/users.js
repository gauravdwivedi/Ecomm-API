const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {v4 : uuidv4} = require('uuid')
const {Users: {FIELDS: USERS_FIELDS, TABLE_NAME: USERS_TABLE_NAME}} = require("../../model/child");

class Users extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.tableName = USERS_TABLE_NAME;
    this.connection = super.connection();
  }
  
  /**
  * fetching details of all sites
  */
  async fetchAll(){
    let query = SqlString.format(`SELECT * FROM \`${this.tableName}\``, []);
    let results = await this.connection.query(query, super.getQueryType('SELECT'));
    return results;
  }

  /**
   * Get user detail
   * @returns 
   */
  async getUserDetail(userId, callback){
    let query = SqlString.format(`SELECT ${USERS_FIELDS.ID},
    ${USERS_FIELDS.EMAIL},
    ${USERS_FIELDS.AVATAR},
    ${USERS_FIELDS.EMAIL_VERIFIED},
    ${USERS_FIELDS.CREATED_AT},
    ${USERS_FIELDS.DOB},
    ${USERS_FIELDS.FIRST_NAME},
    ${USERS_FIELDS.LAST_NAME},
    ${USERS_FIELDS.LAST_NAME},
    ${USERS_FIELDS.GENDER},
    ${USERS_FIELDS.PHONE},
    ${USERS_FIELDS.ROLE},
    ${USERS_FIELDS.STATUS}
    FROM \`${this.tableName}\` where ${USERS_FIELDS.ID} = ?`, [userId]);

    this.connection.query(query, super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : {})
    }).catch(error => callback(error, null));
  }

  /**
   * Get user login
   * @returns 
   */
   async login(params, callback){
     const { email, password } = params;
    let query = SqlString.format(`SELECT * FROM \`${this.tableName}\` where ${USERS_FIELDS.EMAIL} = ? AND ${USERS_FIELDS.PASSWORD} = ?`, [email, password]);

    this.connection.query(query, super.getQueryType('SELECT')).then(result => {
      callback(null, result && result[0] ? result[0] : {})
    }).catch(error => callback(error, null));
  }
  
  /**
  * registering new user
  * @param {*} email 
  * @param {*} password 
  * @param {*} options 
  */
  async register(email, password, options = {}){
    let id = uuidv4();
    const query = `INSERT INTO \`${this.tableName}\`
    (${USERS_FIELDS.ID}, ${USERS_FIELDS.SITE_ID}, ${USERS_FIELDS.EMAIL}, ${USERS_FIELDS.PASSWORD}, ${USERS_FIELDS.FIRST_NAME}, ${USERS_FIELDS.LAST_NAME}, ${USERS_FIELDS.PHONE}, ${USERS_FIELDS.ROLE}, ${USERS_FIELDS.EMAIL_VERIFIED}, ${USERS_FIELDS.STATUS})
    VALUES(?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY
    UPDATE ${USERS_FIELDS.FIRST_NAME}=?`;

    const params =  [id, options[USERS_FIELDS.SITE_ID], email, password, options[USERS_FIELDS.FIRST_NAME], options[USERS_FIELDS.LAST_NAME], options[USERS_FIELDS.PHONE], 2, 0, 1, options[USERS_FIELDS.FIRST_NAME]]

    await this.connection.query(SqlString.format(query,params), super.getQueryType('INSERT'));
    return id;
  }
  
  /**
  * updating password
  * @param {*} email 
  * @param {*} password 
  * @param {*} options 
  */
  async updatePassword(email, password){
    let query = SqlString.format(`UPDATE \`${this.tableName}\`
    SET ${USERS_FIELDS.PASSWORD} = ?
    WHERE ${USERS_FIELDS.EMAIL} = ?`,
    [password, email]);
    return await this.connection.query(query, super.getQueryType('UPDATE'));
  }

    /**
  * updating role
  * @param {*} userId 
  * @param {*} role 
  */
    async updateRole(userId, role){
      let query = SqlString.format(`UPDATE \`${this.tableName}\`
      SET ${USERS_FIELDS.ROLE} = ?
      WHERE ${USERS_FIELDS.ID} = ?`,
      [role, userId]);
      return await this.connection.query(query, super.getQueryType('UPDATE'));
    }


    /**
     * 
     * @param {*} userId 
     * @param {*} options 
     * @returns 
     */

    async deleteUser(userId){
      console.log('UserID',userId)
        let query = SqlString.format(`UPDATE \`${this.tableName}\`
          SET ${USERS_FIELDS.STATUS}=?
          WHERE ${USERS_FIELDS.ID} =?`,
          [0,userId]);
          return await this.connection.query(query,super.getQueryType('UPDATE'));
    }
  
    /**
    * Updating user info
    * @param {*} userId 
    * @param {*} options 
    */
    async updateUser(userId, options = {}){
        if(!Object.keys(options).length) return;
        let query = ``;
        const values = [];
        
        if(options[USERS_FIELDS.FIRST_NAME]){
          query += `SET ${USERS_FIELDS.FIRST_NAME} = ? `;
          values.push(options[USERS_FIELDS.FIRST_NAME])
        }
        if(options[USERS_FIELDS.LAST_NAME]){
          query += `, ${USERS_FIELDS.LAST_NAME} = ? `;
          values.push(options[USERS_FIELDS.LAST_NAME])
        }
        
        if(options[USERS_FIELDS.GENDER]){
          query += `, ${USERS_FIELDS.GENDER} = ? `;
          values.push(options[USERS_FIELDS.GENDER])
        }

        if(options[USERS_FIELDS.DOB]){
          query += `, ${USERS_FIELDS.DOB} = ? `;
          values.push(options[USERS_FIELDS.DOB])
        }

        if(options[USERS_FIELDS.PHONE]){
          query += `, ${USERS_FIELDS.PHONE} = ? `;
          values.push(options[USERS_FIELDS.PHONE])
        }

        if(options[USERS_FIELDS.ROLE]){
          query += `, ${USERS_FIELDS.ROLE} = ? `;
          values.push(options[USERS_FIELDS.ROLE])
        }
        
        if(!query.length) return;
        
        query = `UPDATE \`${this.tableName}\` ` + query + `WHERE ${USERS_FIELDS.ID} = ?`;
        values.push(userId);
        return await this.connection.query(SqlString.format(query, values), super.getQueryType('UPDATE'));
    
  }
}

module.exports = Users;
