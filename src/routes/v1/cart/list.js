const ApiError = require("../ApiError");
const { Cart, ProductImages } = require("../../../core/sql/controller/child");

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
list.listCart = async(req, res, next) => {
  try {
    const userId = req._userId;
    const CartObj = new Cart(req._siteId);
    const response = await CartObj.listCart(userId);
    let myResp = [];
    for (let i = 0; i < response.length; i++) {
      const cart = response[i];
      const pImages = await new ProductImages(req._siteId).getProductImages(cart.productId);
      const pImage = pImages && pImages.length ? pImages[0]?.url : '';
      myResp.push({...cart, pImage});
    }
    req._response = myResp;
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
list.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = list;