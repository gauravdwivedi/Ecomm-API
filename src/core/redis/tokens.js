const moment = require('moment');
const key = require("./keys");

const AbsractRedis = require("./abstract");

const TTL_SSO = 2*30*24*60*60;  //2 months
const TTL_SIGN_UP = 10*60;  //10 minutes
const TTL_RESET_PASSWORD = 10*60;  //10 minutes

class Tokens extends AbsractRedis{
  constructor(siteId){
    super(siteId);
  }
  
  /**
  * Saving SSO token with TTL
  * @param {*} token sso token
  * @param {*} userId userId
  */
  async saveSSO(token, userId){
    const _key = key.SSO_TOKEN.format({token});
    await super.asyncHmset(_key, {
      userId,
      iat: moment().unix()
    });
    super.expire(_key, TTL_SSO);
    return;
  }
  
  /**
  * verifying if token is valid or not
  * @param {*} token 
  * @param {*} userId 
  */
  async verifySSO(token, userId){
    const _key = key.SSO_TOKEN.format({token});
    const value = await super.asyncHget({
      key: _key,
      field: "userId"
    });
    if(value == userId) return true;
    return false;
  }
  
  /**
  * invalidating sso token
  * @param {*} token 
  */
  async invalidateSSO(token){
    const _key = key.SSO_TOKEN.format({token});
    super.del(_key, () => {});
    return;
  }
  
  /**
  * Saving Sign up token with TTL
  * @param {*} token sso token
  */
  async saveSignUpToken(token, email){
    const _key = key.SIGN_UP_TOKEN.format({token});
    await super.asyncHmset(_key, {
      email
    });
    super.expire(_key, TTL_SIGN_UP);
    return;
  }
  
  /**
  * verifying if token is valid or not
  * @param {*} token 
  */
  async verifySignUp(token, email){
    const _key = key.SIGN_UP_TOKEN.format({token});
    const value = await super.asyncHget({
      key: _key,
      field: "email"
    });
    if(value === email) return true;
    return false;
  }
  
  /**
  * invalidating sign up token
  * @param {*} token 
  */
  async invalidateSignUpToken(token){
    const _key = key.SIGN_UP_TOKEN.format({token});
    return await super.del(_key, () => {});;
  }
  
  /**
  * saving reset password token
  * @param {*} token 
  * @param {*} email 
  */
  async saveResetPasswordToken(token, email){
    const _key = key.RESET_PASSWORD_TOKEN.format({token});
    await super.asyncHmset(_key, {
      email,
      iat: moment().unix()
    });
    super.expire(_key, TTL_RESET_PASSWORD);
    return;
  }
  
  /**
  * getting reset password token email
  * @param {*} token 
  */
  async getResetPasswordToken(token){
    const _key = key.RESET_PASSWORD_TOKEN.format({token});
    return await super.asyncHget({
      key: _key,
      field: "email"
    });
  }
  
  /**
  * invalidating reset password token
  * @param {*} token 
  */
  async invalidateResetPasswordToken(token){
    const _key = key.RESET_PASSWORD_TOKEN.format({token});
    return await super.del(_key, () => {});
  }
}

module.exports = Tokens;