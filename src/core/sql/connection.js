const mysql = require("mysql");

const pools = [];
const config = require("../../config/handler").getConfig();

class Connection {
  static createPool(name) {
    const pool = mysql.createPool({
      connectionLimit: 10,
      port: config.SQL.PORT,
      host: config.SQL.HOST,
      user: config.SQL.USER,
      password: config.SQL.PASSWORD,
      database: config.SQL.DATABASE,
    });

    pools[name] = pool;
    return pool;
  }

  static getPool(name) {
    if (name in pools && pools[name] !== undefined) {
      return pools[name];
    } else {
      return Connection.createPool(name);
    }

  }

}

module.exports = Connection;
