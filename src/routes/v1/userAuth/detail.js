const {UserBasicInfo: UserBasicInfoRedis} = require("../../../core/redis");
const childConfig = require("../../../config/configs");
const ApiError = require("../ApiError");

const detail = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.validateRequest = async(req, res, next) => {
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.getDetail = async(req, res, next) => {
  const iUserBasicInfoRedis = new UserBasicInfoRedis(req._siteId);
  iUserBasicInfoRedis.getUserShortDetail(req._userId).then(userProfile=>{
    req._userProfileData = userProfile;
    next();
  })
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.sendResponse = async(req, res, next) => {
  res.status(200).send(req._userProfileData);
  next();
}

module.exports = detail;