const jwt = require('jsonwebtoken');
const superConfig = require("../../../config/super").getConfig();
const {Users: UsersSQL} = require("../../../core/sql/controller/child");
const {Users: {FIELDS: USERS_SQL_FIELDS, FIELDS_VALUES: USERS_SQL_FIELDS_VALUES}} = require("../../../core/sql/model/child");
const ApiError = require("../ApiError");
const {UniqueIdentifier: UniqueIdentifierRedis, UserBasicInfo: UserBasicInfoRedis, Tokens: TokensRedis} = require("../../../core/redis");
const cookieHelper = require("../../../core/helper/cookieHelper");
const moment = require('moment');
const { Base64 } = require('js-base64');


const register = {};

/**
* verifying sign up token
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
register.authenticateSignUpToken = async(req, res, next) => {
  const {email} = req.body;
  
  if(typeof email !== 'string' || email.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  
  let signUpToken = req.cookies[cookieHelper.COOKIE_NAME_SIGN_UP_TOKEN];
  !signUpToken && (signUpToken = req.headers["x-signup-token"]);
  const iTokensRedis = new TokensRedis(req._siteId);
  req._iTokensRedis = iTokensRedis;
  isValidRegistration = await iTokensRedis.verifySignUp(signUpToken, email);
  if(!isValidRegistration) return res.status(401).send();
  iTokensRedis.invalidateSignUpToken(signUpToken);
  next();
}

/**
* validating request body
* encrypting password
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
register.validateRequest = async(req, res, next) => {
  const {password, firstName, lastName, avatar} = req.body;
  
  if(typeof password !== 'string' || password.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  req.body.password = Base64.encode(req.body.password);
  
  if(typeof firstName !== 'string' || firstName.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }
  
  if(typeof lastName !== 'string' || lastName.length > 100){
    return next(new ApiError(400, 'E0010004'));
  }

  if(Object.keys(req.body).includes('avatar') && typeof avatar !== 'string'){
    return next(new ApiError(400, 'E0010004'));
  }
  next();
}


register.ifSignUp = async(req, res, next) => {
  req.body.createdAt = moment().format("YYYY-MM-DD HH:mm:ss");
  req.body.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
  
  const [userId, x] = await new UsersSQL(req._siteId).register(req.body.email, req.body.password, {
    [USERS_SQL_FIELDS.EMAIL]: req.body.email,
    [USERS_SQL_FIELDS.PASSWORD]: req.body.password,
    [USERS_SQL_FIELDS.FIRST_NAME]: req.body.firstName,
    [USERS_SQL_FIELDS.LAST_NAME]: req.body.lastName,
    [USERS_SQL_FIELDS.AVATAR]: req.body.avatar,
    [USERS_SQL_FIELDS.CREATED_AT]: req.body.createdAt,
    [USERS_SQL_FIELDS.UPDATED_AT]: req.body.updatedAt,
  });
  req._userId = userId;
  
  await new UniqueIdentifierRedis(req._siteId).save(req.body.email, req._userId);
  
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  const _toAddInRedis = {
    [iUserBasicInfoRedis.HASH_FIELDS().USER_ID]: userId,
    [iUserBasicInfoRedis.HASH_FIELDS().EMAIL]: req.body.email,
    [iUserBasicInfoRedis.HASH_FIELDS().PASSWORD]: req.body.password,
    [iUserBasicInfoRedis.HASH_FIELDS().FIRST_NAME]: req.body.firstName,
    [iUserBasicInfoRedis.HASH_FIELDS().LAST_NAME]: req.body.lastName,
    [iUserBasicInfoRedis.HASH_FIELDS().CREATED_AT]: req.body.createdAt,
    [iUserBasicInfoRedis.HASH_FIELDS().UPDATED_AT]: req.body.updatedAt
  };
  req.body.avatar && (_toAddInRedis[iUserBasicInfoRedis.HASH_FIELDS().AVATAR] = req.body.avatar);
  req._userBasicInfo = _toAddInRedis;
  await iUserBasicInfoRedis.save(userId, _toAddInRedis);
  next();
}


register.generateToken = async(req, res, next) => {
  const token = jwt.sign({ id: req._userId }, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}), {});
  await req._iTokensRedis.saveSSO(token, req._userId);
  req._token = token;
  next();
}

register.sendResponse = async(req, res, next) => {
  res.status(200).send({
    token: req._token,
    user: {
      userId: req._userBasicInfo.user_id,
      firstName: req._userBasicInfo.first_name,
      lastName: req._userBasicInfo.last_name,
      avatar: req._userBasicInfo.avatar || "",
    }
  });
  next();
}

module.exports = register;