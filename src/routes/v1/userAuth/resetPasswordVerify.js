const { Base64 } = require('js-base64');
const ApiError = require("../ApiError");
const {Tokens: TokensRedis, UniqueIdentifier: UniqueIdentifierRedis, UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const {Users: UsersSQL} = require("../../../core/sql/controller/child");

const resetPasswordVerify = {};

resetPasswordVerify.validateRequest = async(req, res, next) => {
  const {token, password} = req.body;
  
  if(typeof token !== 'string'){
    return next(new ApiError(400, 'E0010004', {
      message: 'token is invalid/missing'
    }));
  }
  if(typeof password !== 'string'){
    return next(new ApiError(400, 'E0010004', {
      message: 'password is invalid/missing'
    }));
  }
  next();
}

resetPasswordVerify.validateToken = async(req, res, next) => {
  try{
    req._email = await new TokensRedis(req._siteId).getResetPasswordToken(req.body.token);
    if(!req._email) return next(new ApiError(400, 'E0010001', {
      message: 'Token is expired or invalid. Please try again!'
    }))
    next();
  }catch(e){
    return next(new ApiError(400, 'E0010001', {
      message: 'Error in retrieving token',
      debug: e
    }))
  }
}

resetPasswordVerify.savePassword = async(req, res, next) => {
  try{
    const userId = await new UniqueIdentifierRedis(req._siteId).isAlreadyRegistered(req._email);
    if(!userId) return next(new ApiError(400, 'E0010001', {
      message: 'Sorry, we could not find an account linked to this email address. Please register again.'
    }));
    req.body.password = Base64.encode(req.body.password);
    await new UsersSQL(req._siteId).updatePassword(req._email, req.body.password);
    await new UserBasicInfoRedis(req._siteId).updatePassword(userId, req.body.password);
    await new TokensRedis(req._siteId).invalidateResetPasswordToken(req.body.token);
    next();
  }catch(e){
    return next(new ApiError(400, 'E0010001', {
      message: 'Error in validating token',
      debug: e
    }))
  }
}

resetPasswordVerify.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = resetPasswordVerify;