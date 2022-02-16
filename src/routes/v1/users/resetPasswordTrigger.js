const ApiError = require("../ApiError");
const tokenHelper = require("../../../core/helper/tokenHelper");
const {Tokens: TokensRedis, UniqueIdentifier: UniqueIdentifierRedis} = require("../../../core/redis");
const {emailService} = require("../../../services");

const resetPasswordTrigger = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
resetPasswordTrigger.validateRequest = async(req, res, next) => {
  const {email} = req.body;
  if(typeof email !== 'string'){
    return next(new ApiError(400, 'E0010004'));
  }
  try{
    if(!await new UniqueIdentifierRedis(req._siteId).isAlreadyRegistered(email)){
      return next(new ApiError(400, 'E0010001', {
        message: 'Sorry, we could not find an account linked to this email address. Please register again.'
      }))
    }
  }catch(e){
    return next(new ApiError(400, 'E0010001', {
      message: 'Error in fetching account details. Please try again!',
      debug: e
    }))
  }
  next();
}

/**
* generating token
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
resetPasswordTrigger.generateToken = async(req, res, next) => {
  req._token = tokenHelper.generate(req.body.email);
  next();
}

/**
* saving token in redis
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
resetPasswordTrigger.saveToken = async(req, res, next) => {
  try{
    await new TokensRedis(req._siteId).saveResetPasswordToken(req._token, req.body.email);
    next();
  }catch(e){
    return next(new ApiError(400, 'E0010001', {
      message: 'error in saving token',
      debug: e
    }))
  }
}

resetPasswordTrigger.sendEmail = async(req, res, next) => {
  try{
    await emailService.resetPassword(req.body.email, req._token);
  }catch(e){
    return next(new ApiError(400, 'E0010001', {
      message: 'error in sending email',
      debug: e
    }))
  }
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
resetPasswordTrigger.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = resetPasswordTrigger;