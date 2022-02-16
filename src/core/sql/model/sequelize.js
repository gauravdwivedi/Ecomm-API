const Sequelize = require('sequelize');
const config = require("./../../../config/super").getConfig();

const sequelize = new Sequelize(config.SQL.DB_NAME, config.SQL.USERNAME, config.SQL.PASSWORD, {
  host: config.SQL.HOST,
  dialect: config.SQL.DIALECT,
  logging: true
});

module.exports = {
  sequelize, Sequelize
};

