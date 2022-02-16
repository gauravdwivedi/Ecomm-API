/**
* Module specific to child_credentials table
*/

const TABLE_NAME = "child_credentials";
const FIELDS = {
  SITE_ID: "site_id",
  SITE_NAME: "site_name",
  SQL_HOST: "sql_host",
  SQL_PORT: "sql_port",
  SQL_USERNAME: "sql_username",
  SQL_PASSWORD: "sql_password",
  SQL_DB_NAME: "sql_db_name",
  REDIS_HOST: "redis_host",
  REDIS_PORT: "redis_port",
  REDIS_PASSWORD: "redis_password",
  STATUS: "status"
}

const FIELDS_VALUES = {
  STATUS: {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2
  }
}

module.exports = {
  TABLE_NAME, FIELDS, FIELDS_VALUES
};