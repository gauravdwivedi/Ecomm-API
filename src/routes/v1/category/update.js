const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");

const update = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
update.validateRequest = async(req, res, next) => {
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
update.updateCategoryDetails = async(req, res, next) => {
  const CategoryObj = new Category(req._siteId);
  CategoryObj.updateDetailByID(req.body, (err, response) => {
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
update.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = update;