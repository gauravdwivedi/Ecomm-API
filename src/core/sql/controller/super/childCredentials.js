const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');
const {childCredentials: {FIELDS: CHILD_CREDENTIALS_FIELDS, TABLE_NAME: CHILD_CREDENTIALS_TABLE_NAME, FIELDS_VALUES: CHILD_CREDENTIALS_FIELDS_VALUES}} = require("../../model/super");

class ChildCredentials extends AbstractSQL{
  constructor(){
    super();
    this.tableName = CHILD_CREDENTIALS_TABLE_NAME;
    this.connection = super.connection();
  }
  
  /**
  * fetching details of all sites
  */
  async fetchAll(){
    let query = SqlString.format(`SELECT * FROM ${this.tableName}`, []);
    let results = await this.connection.query(query, super.getQueryType('SELECT'));
    return results;
  }
  
  /**
  * 
  * @param {*} siteId 
  */
  async fetchForSite(siteId){
    let query = `SELECT * FROM ${this.tableName}
    WHERE ${CHILD_CREDENTIALS_FIELDS.SITE_ID} = ?
    AND ${CHILD_CREDENTIALS_FIELDS.STATUS} = ${CHILD_CREDENTIALS_FIELDS_VALUES.STATUS.ACTIVE}`;

    query = SqlString.format(query, [siteId]);
    let results = await this.connection.query(query, super.getQueryType('SELECT'));
    results = Array.isArray(results) && results.length && results[0];
    return results;
  }
}

module.exports = ChildCredentials;
