const ApiError = require("../ApiError");
const {Product, Orders } = require("../../../core/sql/controller/child");

const newOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
newOrder.validateRequest = async(req, res, next) => {
  const { productId, variantId, quantity, addressId } = req.body;
  const userId = req._userId;
  req.body.userId = userId;
  if(!( userId && productId && variantId && quantity && addressId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
newOrder.new = async(req, res, next) => {
  try {
    const { userId,productId, variantId, quantity, addressId } = req.body;
    const OrdersObj = new Orders(req._siteId);
    const product = await OrdersObj.variantsByVariantId(variantId);
    if(product){
        let notes = req.body.notes 
        let param = {userid:userId, variantId, productId, quantity, addressId, notes, status:"pending", deliveryStatus:"processing", priceBeforeTax :product.price, priceAfterTax :product.price, discount : 0, tax : 0}
        const response = await OrdersObj.newOrder(param)
        req._response = response;
        next();
    }else{
        return next(new ApiError(400, 'E0010006'));
    }
    
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
newOrder.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = newOrder;