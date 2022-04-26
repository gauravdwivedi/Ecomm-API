const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");

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
list.getCategoryList = async(req, res, next) => {
  const CategoryObj = new Category(req._siteId);
  CategoryObj.fetchList((err, list) => {
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
  res.status(200).send({result: req._response});
  next();
}

module.exports = list;