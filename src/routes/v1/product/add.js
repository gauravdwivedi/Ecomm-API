const ApiError = require("../ApiError");
const { Product } = require("../../../core/sql/controller/child");

const add = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.validateRequest = async(req, res, next) => {
  const { title, category, video_url, rating, slug, images, attributes } = req.body;
  if(!(title && category && slug && images && attributes )) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.addProduct = async(req, res, next) => {
  const { title, category, video_url, rating, slug, images, attributes } = req.body;
  const ProductObj = new Product(req._siteId);
  ProductObj.add(req.body, (err, response) => {
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
add.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = add;