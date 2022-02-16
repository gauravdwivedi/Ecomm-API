const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const {Users: UsersSQL} = require("../../../core/sql/controller/child");
const ApiError = require("../ApiError");
const {Users: {FIELDS: USERS_SQL_FIELDS}} = require("../../../core/sql/model/child");
const C = require("../../../constants");
const moment = require('moment');

const updateUserDetails = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
updateUserDetails.validateRequest = async(req, res, next) => {
  const {firstName, lastName, avatar, gender, dob, phone} = req.body;
  
  if(Object.keys(req.body).includes('firstName') && (typeof firstName !== 'string' || firstName.length > 100)){
    return next(new ApiError(401, 'E0010004'));
  }
  
  if(Object.keys(req.body).includes('lastName') && (typeof lastName !== 'string' || lastName.length > 100)){
    return next(new ApiError(401, 'E0010004'));
  }
  
  if(Object.keys(req.body).includes('avatar') && (typeof avatar !== 'string')){
    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('gender') && !Object.values(C.ALLOWED_GENDERS).includes(gender)){
    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('dob') && !moment(dob, 'YYYY-MM-DD', true).isValid()){
    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('phone') && typeof phone !== 'string'){
    return next(new ApiError(401, 'E0010004'));
  }
  
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
updateUserDetails.save = async(req, res, next) => {
  const {firstName, lastName, avatar, gender, dob, phone} = req.body;
  await new UsersSQL(req._siteId).updateUser(req._userId, {
    [USERS_SQL_FIELDS.FIRST_NAME]: firstName || undefined,
    [USERS_SQL_FIELDS.LAST_NAME]: lastName || undefined,
    [USERS_SQL_FIELDS.AVATAR]: avatar || undefined,
    [USERS_SQL_FIELDS.DOB]: dob || undefined,
    [USERS_SQL_FIELDS.GENDER]: gender || undefined,
    [USERS_SQL_FIELDS.PHONE]: phone || undefined,
  });
  
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  await iUserBasicInfoRedis.updateUser(req._userId, {
    [iUserBasicInfoRedis.HASH_FIELDS().FIRST_NAME]: firstName || undefined,
    [iUserBasicInfoRedis.HASH_FIELDS().LAST_NAME]: lastName || undefined,
    [iUserBasicInfoRedis.HASH_FIELDS().AVATAR]: avatar || undefined,
    [iUserBasicInfoRedis.HASH_FIELDS().GENDER]: gender || undefined,
    [iUserBasicInfoRedis.HASH_FIELDS().DOB]: dob || undefined,
    [iUserBasicInfoRedis.HASH_FIELDS().PHONE]: phone || undefined,
  });
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
updateUserDetails.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = updateUserDetails;