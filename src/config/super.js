const {CONFIGS, NESTED_CONFIGS}  =require("./configs");

let __config = {};
let config = {
  getConfig: () => {
    return __config;
  },
  
  setConfig: (envConfig) => {
    __config = envConfig;
  },
  
  getSuperSQLConfigs: () => {
    return {
      [NESTED_CONFIGS[CONFIGS.SQL].HOST]: __config["SQL"]["HOST"],
      [NESTED_CONFIGS[CONFIGS.SQL].PORT]: __config["SQL"]["PORT"],
      [NESTED_CONFIGS[CONFIGS.SQL].USERNAME]: __config["SQL"]["USERNAME"],
      [NESTED_CONFIGS[CONFIGS.SQL].PASSWORD]: __config["SQL"]["PASSWORD"],
      [NESTED_CONFIGS[CONFIGS.SQL].DATABASE_NAME]: __config["SQL"]["DB_NAME"],
      [NESTED_CONFIGS[CONFIGS.SQL].DIALECT]: __config["SQL"]["DIALECT"],
    }
  },

  getSuperRedisConfigs: () => {
    return {
      [NESTED_CONFIGS[CONFIGS.REDIS].HOST]: __config["REDIS"]["HOST"],
      [NESTED_CONFIGS[CONFIGS.REDIS].PORT]: __config["REDIS"]["PORT"],
      [NESTED_CONFIGS[CONFIGS.REDIS].PASSWORD]: __config["REDIS"]["PASSWORD"],
    }
  }
};

module.exports = config;
