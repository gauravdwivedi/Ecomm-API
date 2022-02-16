const Connection = require("./connection");

const executeQuery = (config = {}, callback) => {
  /*
  This function will prepare queries and execute them
  @params:
  query: query to execute with dynamic field values replaced by ?
  values: values to escape and bind in the query
  Caution: There should not be any ? in any string else it will also get replaced and it will throw error
  */
  const dbName = (typeof config.options.db !== "undefined") ? config.options.db : config.CONNECTION_POOL_NAME;
  const connection = Connection.getPool(dbName);
  config.options.tag = config.options.tag || "NO_TAG";
  console.log(`[SQL QUERY EXECUTING]:[${config.options.tag}] ${config.query}`);
  connection.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      return callback(err, connection);
    }
    return callback(null, {query: connection.query(config.query, config.values), connection});
  });
}

module.exports = executeQuery;