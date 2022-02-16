const Sequelize = require('sequelize');
const {CONFIGS, NESTED_CONFIGS} = require("../../../config/configs");
const childConfig = require("../../../config/configs");
const superConfig = require("../../../config/super");
class AbstractSQL{
  constructor(siteId){
    const configs = siteId ? childConfig.SQL_CREDENTIALS(siteId) : superConfig.getSuperSQLConfigs();
    this.sequelize = new Sequelize(configs[NESTED_CONFIGS[CONFIGS.SQL].DATABASE_NAME], configs[NESTED_CONFIGS[CONFIGS.SQL].USERNAME], configs[NESTED_CONFIGS[CONFIGS.SQL].PASSWORD], {
      host: configs[NESTED_CONFIGS[CONFIGS.SQL].HOST],
      dialect: configs[NESTED_CONFIGS[CONFIGS.SQL].DIALECT],
      logging: true
    });
  }

  getQueryType(type){
    if(type) type = type.toUpperCase();
    switch(type){
      case "SELECT": return {type: this.sequelize.QueryTypes.SELECT};
      case "INSERT": return {type: this.sequelize.QueryTypes.INSERT};
      case "UPDATE": return {type: this.sequelize.QueryTypes.UPDATE};
      case "DELETE": return {type: this.sequelize.QueryTypes.DELETE};
      default: return {type: this.sequelize.QueryTypes.SELECT};
    }
  }
  
  connection(){
    return this.sequelize;
  }
}

module.exports = AbstractSQL;