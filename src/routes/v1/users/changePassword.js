const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const {Users: UsersSQL} = require("../../../core/sql/controller/child");
const ApiError = require("../ApiError");
const { Base64 } = require('js-base64');

const forgotPassword = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
forgotPassword.validateRequest = async(req, res, next) => {
  const {email, oldPassword, newPassword} = req.body;
  
  if(typeof email !== 'string' || email.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  
  if(typeof oldPassword !== 'string' || oldPassword.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  req.body.oldPassword = Base64.encode(oldPassword);
  
  if(typeof newPassword !== 'string' || newPassword.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  req.body.newPassword = Base64.encode(newPassword);
  next();
}

/**
* matching the password
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
forgotPassword.matchPassword = async(req, res, next) => {
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  req._iUserBasicInfoRedis = iUserBasicInfoRedis;
  req._userBasicInfo = await iUserBasicInfoRedis.getAllUserInfo(req._userId);
  if(!req._userBasicInfo) return next(new ApiError(400, 'E0010001'));
  if(req.body.oldPassword === req._userBasicInfo.password){
    next();
  }else{
    return next(new ApiError(400, 'E0020001'))
  }
}

/**
* saving new password
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
forgotPassword.saveNewPassword = async(req, res, next) => {
  await new UsersSQL(req._siteId).updatePassword(req.body.email, req.body.newPassword);
  await req._iUserBasicInfoRedis.updatePassword(req._userBasicInfo.user_id, req.body.newPassword);
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
forgotPassword.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = forgotPassword;