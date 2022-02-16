const configs = require("../../config/configs");
const superConfigs = require("../../config/super");
const {ChildCredentials} = require("../../core/sql/controller/super");
const {childCredentials: {FIELDS: CHILD_CREDENTIALS_FIELDS}} = require("../../core/sql/model/super");
const jwt = require('jsonwebtoken');
const superConfig = require("../../config/super").getConfig();
const cookieHelper = require("../../core/helper/cookieHelper");
const {Tokens: TokensRedis} = require("../../core/redis");
const ApiError = require("./ApiError");

const auth = {};

/**
* verifying jwt token
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
auth.verify = async(req, res, next) => {
  let token = req.cookies[cookieHelper.COOKIE_NAME_SSO_TOKEN];
  !token && (token = req.headers["x-sso-token"]);

  if(!token) return res.status(401).send();
  
  try{
    const decoded = jwt.verify(token, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}));

    const {id} = decoded;
    if(!id) return res.status(401).send();
    const isAuthenticatedUser = await new TokensRedis(req._siteId).verifySSO(token, id);
    if(!isAuthenticatedUser) return res.status(401).send();
    req._userId = id;
    
    next();
  }catch(err){
    return next(new ApiError(500, 'E0010001', {debug: err}))
  }
}


auth.setProfile = async(req, res, next) => {
  let token = req.cookies[cookieHelper.COOKIE_NAME_SSO_TOKEN];
  !token && (token = req.headers["x-sso-token"]);

  if(token){
    try{
      const decoded = jwt.verify(token, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}));
      const {id} = decoded;
      if(id){
        req._userId = Number(id);
        next();
      }
      else next();
    }
    catch(err){
      return next();
    }
  } 
  else next(); 
}

/**
* Setting site's credentials
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
auth.setCredentials = async(req, res, next) => {
  const siteId = req.headers["site-id"];
  if(!siteId) return res.status(401).send();
  
  req._siteId = siteId;
  
  await _setCredentials(req);
  if(!req._configs) return res.status(401).send();
  next();
}

module.exports = auth;

/**
* fetching credentials and setting them in global variables
* @param {*} req 
*/
const _setCredentials = async(req) => {
  const siteId = req._siteId;
  
  const SQL_CONFIGS = configs.SQL_CREDENTIALS(siteId);
  const REDIS_CONFIGS = configs.REDIS_CREDENTIALS(siteId);

  if(!SQL_CONFIGS || !REDIS_CONFIGS){
    const result = await new ChildCredentials().fetchForSite(siteId);
    result && (req._configs = {
      [configs.CONFIGS.SQL]: {
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].HOST]: result[CHILD_CREDENTIALS_FIELDS.SQL_HOST],
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].PORT]: result[CHILD_CREDENTIALS_FIELDS.SQL_PORT],
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].USERNAME]: result[CHILD_CREDENTIALS_FIELDS.SQL_USERNAME],
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].PASSWORD]: result[CHILD_CREDENTIALS_FIELDS.SQL_PASSWORD],
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].DATABASE_NAME]: result[CHILD_CREDENTIALS_FIELDS.SQL_DB_NAME],
        [configs.NESTED_CONFIGS[configs.CONFIGS.SQL].DIALECT]: "mysql",
      },
      [configs.CONFIGS.REDIS]: {
        [configs.NESTED_CONFIGS[configs.CONFIGS.REDIS].HOST]: result[CHILD_CREDENTIALS_FIELDS.REDIS_HOST],
        [configs.NESTED_CONFIGS[configs.CONFIGS.REDIS].PORT]: result[CHILD_CREDENTIALS_FIELDS.REDIS_PORT],
        [configs.NESTED_CONFIGS[configs.CONFIGS.REDIS].PASSWORD]: result[CHILD_CREDENTIALS_FIELDS.REDIS_PASSWORD],
      }
    })
    req._configs && configs.SET_FOR_SITE({siteId, ...req._configs});
  }else{
    req._configs = configs.ALL_CONFIGS(siteId);
  }
  return;
}