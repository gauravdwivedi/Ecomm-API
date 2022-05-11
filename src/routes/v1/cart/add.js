const ApiError = require("../ApiError");
const { Cart } = require("../../../core/sql/controller/child");

const addToCart = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
addToCart.validateRequest = async(req, res, next) => {
  const { productId, variantId, quantity } = req.body;
  const userId = req._userId;
  req.body.userId = userId;
  if(!( userId && productId && variantId && quantity )) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
addToCart.add = async(req, res, next) => {
  try {
    const CartObj = new Cart(req._siteId);
    const response = await CartObj.addToCart(req.body)
    req._response = response;
    next();
  } catch(err) {
    console.log(err);
    req._response = {};
    next();
  }
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
addToCart.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = addToCart;