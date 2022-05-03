const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");

const addCategory = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
addCategory.validateRequest = async(req, res, next) => {
  const { title, icon, slug } = req.body;
  if(!(title && icon && slug )) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
addCategory.add = async(req, res, next) => {
  const CategoryObj = new Category(req._siteId);
  
  CategoryObj.addCategory(req.body, (err, response) => {
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
addCategory.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = addCategory;