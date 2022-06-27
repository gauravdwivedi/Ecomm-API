const ApiError = require("../ApiError");
const {Product, Orders } = require("../../../core/sql/controller/child");
const Razorpay = require("razorpay");

const newOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
newOrder.validateRequest = async(req, res, next) => {
  const { productId, variantId, quantity, addressId } = req.body;
  if(!( productId && variantId && quantity && addressId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
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
    const { productId, variantId, quantity, addressId } = req.body;
    const userId = req._userId;
    
    const OrdersObj = new Orders(req._siteId);
    const product = await OrdersObj.variantsByVariantId(variantId);
    if(product){
      var instance = new Razorpay({ key_id: process.env['RAZORPAY:KEY_ID'], key_secret: process.env['RAZORPAY:KEY_SECRET'] })

      const createdOrder = await instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1"
      })
      
      let notes = req.body.notes 
      let param = {userid: userId, variantId, productId, quantity, razorpayOrderId: createdOrder?.['id'], addressId, notes, status:"pending", deliveryStatus:"processing", priceBeforeTax :product.price, priceAfterTax :product.price, discount : 0, tax : 0}
      const response = await OrdersObj.newOrder(param)
      createdOrder.hoppedinOrderId = response
      req._response = createdOrder;
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