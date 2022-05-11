const ApiError = require("../ApiError");
const { Cart } = require("../../../core/sql/controller/child");

const removeFromCart = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
removeFromCart.validateRequest = async(req, res, next) => {
  const { id } = req.body;
  if(!id) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
removeFromCart.removeFromCart = async(req, res, next) => {
  try {
    const { id } = req.body;
    const CartObj = new Cart(req._siteId);
    const response = await CartObj.removeFromCart(id);
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
removeFromCart.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = removeFromCart;