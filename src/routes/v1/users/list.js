const ApiError = require("../ApiError");
const { Users } = require("../../../core/sql/controller/child");

const list = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
list.validateRequest = async(req, res, next) => {
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
list.getUsersList = async(req, res, next) => {
  const UsersObj = new Users(req._siteId);
  UsersObj.fetchList((err, list) => {
    req._response = list;
    next();
  })
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
list.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = list;