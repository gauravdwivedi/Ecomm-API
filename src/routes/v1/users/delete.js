const ApiError = require("../ApiError");
const { Users } = require("../../../core/sql/controller/child");
const { Base64 } = require("js-base64");

const deleteUser = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.validateRequest = async(req, res, next) => {
  const { userId } = req.body;
  if(!userId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.deleteUser = async(req, res, next) => {
  const { userId } = req.body;
  const UsersObj = new Users(req._siteId);
  UsersObj.deleteUser(userId, (err, response) => {
    req._response = response;
    next();
  })
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteUser.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = deleteUser;