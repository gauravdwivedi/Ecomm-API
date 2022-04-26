const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const {Users: UsersSQL} = require("../../../core/sql/controller/child");
const ApiError = require("../ApiError");
const { Base64 } = require('js-base64');

const deleteUser = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.validateRequest = async(req, res, next) => {
  const {userId} = req.body;
  
  if(!userId){
    return next(new ApiError(400, 'E0010004'));
  }
  next();
}

/**
* deleting user
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.deleteUser = async(req, res, next) => {
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  await new UsersSQL(req._siteId).deleteUser(req.body.userId);
  await iUserBasicInfoRedis.deleteUser(req.body.userId);
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.sendResponse = async(req, res, next) => {
  res.status(200).send();
  next();
}

module.exports = deleteUser;