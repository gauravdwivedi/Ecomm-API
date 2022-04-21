const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");

const deleteCategory = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
deleteCategory.validateRequest = async(req, res, next) => {
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
deleteCategory.deleteCategory = async(req, res, next) => {
  const { categoryId } = req.body;
  const CategoryObj = new Category(req._siteId);
  CategoryObj.deleteCategory(categoryId, (err, response) => {
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
deleteCategory.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = deleteCategory;