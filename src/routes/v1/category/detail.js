const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");

const detail = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.validateRequest = async(req, res, next) => {
  const { categoryId } = req.body;
  if(!categoryId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.getCategoryDetail = async(req, res, next) => {
  const { categoryId } = req.body;
  const CategoryObj = new Category(req._siteId);
  const result = await CategoryObj.fetchDetail(categoryId);
  req._response = result;
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = detail;