const CLIENT_CONFIGS = {};

const CONFIGS = {
  SQL: "SQL",
  REDIS: "REDIS"
}

const NESTED_CONFIGS = {
  [CONFIGS.SQL]: {
    DIALECT: "DIALECT",
    USERNAME: "USERNAME",
    PASSWORD: "PASSWORD",
    HOST: "HOST",
    PORT: "PORT",
    DATABASE_NAME: "DATABASE_NAME"
  },
  [CONFIGS.REDIS]: {
    HOST: "HOST",
    PORT: "PORT",
    PASSWORD: "PASSWORD"
  }
}

const config = {};

config.CONFIGS = CONFIGS;
config.NESTED_CONFIGS = NESTED_CONFIGS;

config.ALL_CONFIGS = (siteId) => {
  if(!siteId) throw new TypeError('Invalid argument(s): siteId');
  return CLIENT_CONFIGS[siteId];
}

config.SQL_CREDENTIALS = (siteId) => {
  if(!siteId) throw new TypeError('Invalid argument(s): siteId');
  return CLIENT_CONFIGS[siteId] && CLIENT_CONFIGS[siteId][CONFIGS.SQL]
}

config.REDIS_CREDENTIALS = (siteId) => {
  if(!siteId) throw new TypeError('Invalid argument(s): siteId');
  return CLIENT_CONFIGS[siteId] && CLIENT_CONFIGS[siteId][CONFIGS.REDIS]
}

config.SET_FOR_SITE = (data) => {
  if(!data.siteId) throw new TypeError('Invalid argument(s): siteId');
  CLIENT_CONFIGS[data.siteId] = data;
  return;
}

module.exports = config;