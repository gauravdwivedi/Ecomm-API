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
  console.log('DOB',dob)

  let Newdob=moment(dob).format('YYYY-MM-DD');
  req.body.dob=Newdob

  
  if(Object.keys(req.body).includes('firstName') && (typeof firstName !== 'string' || firstName.length > 100)){
    console.log('1')
    return next(new ApiError(401, 'E0010004'));
  }
  
  if(Object.keys(req.body).includes('lastName') && (typeof lastName !== 'string' || lastName.length > 100)){
    console.log('2')
    return next(new ApiError(401, 'E0010004'));
  }
  
  if(Object.keys(req.body).includes('avatar') && (typeof avatar !== 'string')){

    console.log('3')
    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('gender') && !Object.values(C.GENDERS_LABEL).includes(gender)){
    console.log('4')
    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('dob') && !moment(Newdob, 'YYYY-MM-DD', true).isValid()){
    console.log('5',req.body.dob)

    return next(new ApiError(401, 'E0010004'));
  }

  if(Object.keys(req.body).includes('phone') && typeof phone !== 'number'){
    console.log('6')
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
  
  const {userId,firstName, lastName, avatar, gender, dob, phone} = req.body;

  console.log(userId)

  await new UsersSQL(req._siteId).updateUser(userId, {
    [USERS_SQL_FIELDS.FIRST_NAME]: firstName || undefined,
    [USERS_SQL_FIELDS.LAST_NAME]: lastName || undefined,
    [USERS_SQL_FIELDS.AVATAR]: avatar || undefined,
    [USERS_SQL_FIELDS.DOB]: dob || undefined,
    [USERS_SQL_FIELDS.GENDER]: gender || undefined,
    [USERS_SQL_FIELDS.PHONE]: phone || undefined,
  });
  
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  await iUserBasicInfoRedis.updateUser(userId, {
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