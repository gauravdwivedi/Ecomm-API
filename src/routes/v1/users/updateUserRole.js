const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const {Users: UsersSQL} = require("../../../core/sql/controller/child");
const ApiError = require("../ApiError");
const {Users: {FIELDS: USERS_SQL_FIELDS}} = require("../../../core/sql/model/child");
const C = require("../../../constants");
const moment = require('moment');

const updateUserRole = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
updateUserRole.validateRequest = async(req, res, next) => {
  const {userId, role} = req.body;
  
  if(!userId || !role){
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
updateUserRole.save = async(req, res, next) => {
  const {userId, role} = req.body;
  await new UsersSQL(req._siteId).updateRole(userId, role);
  
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  await iUserBasicInfoRedis.updateRole(userId, role);
  next();
}

/**
* sending response
* @param {*} res 
* @param {*} next 
*/
updateUserRole.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = updateUserRole;