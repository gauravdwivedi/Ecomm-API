const ApiError = require("../ApiError");
const {Orders } = require("../../../core/sql/controller/child");

const cancelOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
cancelOrder.validateRequest = async(req, res, next) => {
  const {orderId } = req.body;
  const userId = req._userId;
  req.body.userId = userId;
  if(!( orderId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
cancelOrder.cancel = async(req, res, next) => {
  try {
    const { orderId } = req.body;
    const OrdersObj = new Orders(req._siteId);
    const response = await OrdersObj.orderStatusUpdate({id:orderId , status: "cancel"})
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
cancelOrder.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = cancelOrder;