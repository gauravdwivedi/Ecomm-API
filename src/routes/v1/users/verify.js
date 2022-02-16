const {UniqueIdentifier: UniqueIdentifierRedis, UserBasicInfo: UserBasicInfoRedis, Tokens: TokensRedis} = require("../../../core/redis");
const superConfig = require("../../../config/super").getConfig();
const moment = require('moment');
const jwt = require('jsonwebtoken');
const ApiError = require("../ApiError");
const { Base64 } = require('js-base64');
const {Users: UsersSQL} = require("../../../core/sql/controller/child");

const verify = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
verify.validate = async(req, res, next) => {
  const {email, password} = req.body;
  
  if(typeof email !== 'string' || email.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  if(typeof password !== 'string' || password.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  req.body.password = Base64.encode(password);
  
  next();
}

/**
* checking if user exists or not with the email
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
verify.checkExistence = async(req, res, next) => {
  const instanceUniqueIdentifierRedis = new UniqueIdentifierRedis(req._siteId);
  req._isAlreadyAnUser = await instanceUniqueIdentifierRedis.isAlreadyRegistered(req.body.email);
  next();
}

/**
* generating jwt
* SSO token for already existing user
* Sign Up token for new user
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
verify.generateToken = async(req, res, next) => {
  if(req._isAlreadyAnUser){
    req._userId = req._isAlreadyAnUser;
    req._userBasicInfo = await new UserBasicInfoRedis(req._siteId).getAllUserInfo(req._userId);
    if(!req._userBasicInfo) return next(new ApiError(400, 'E0010001'));
    
    if(req.body.password === req._userBasicInfo.password){
      const token = jwt.sign({ id: req._userId }, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}), {});
      await new TokensRedis(req._siteId).saveSSO(token, req._userId);
      req._token = token;
      next();
    }else{
      return next(new ApiError(400, 'E0020001'))
    }
  }
  else{
    const _iat = moment().unix()
    const token = jwt.sign({ _iat }, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}), {});
    await new TokensRedis(req._siteId).saveSignUpToken(token, req.body.email);
    req._token = token;
    next();
  }
}

/**
* building and sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
verify.sendResponse = async(req, res, next) => {
  if(req._isAlreadyAnUser){
    res.status(200).send({
      token: req._token,
      registration: false,
      user: {
        userId: req._userBasicInfo.user_id,
        firstName: req._userBasicInfo.first_name,
        lastName: req._userBasicInfo.last_name,
        avatar: req._userBasicInfo.avatar,
      }
    })
    next()
  }else{
    res.status(200).send({
      token: req._token,
      registration: true
    });
    next();
  }
}

module.exports = verify;