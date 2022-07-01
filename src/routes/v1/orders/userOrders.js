const ApiError = require("../ApiError");
const {OrderDetails, Orders } = require("../../../core/sql/controller/child");

const userOrders = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
userOrders.validateRequest = async(req, res, next) => {
    const {userId } = req.params;
    if(!( userId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
userOrders.order = async(req, res, next) => {
  try {
    const {userId } = req.params;
    const OrderObj = new Orders(req._siteId);
    const response = await OrderObj.orders(userId);
    const promises = response.map(async (item) => {
        const OrderDetailsObj = new OrderDetails(req._siteId);
        let temp = await OrderDetailsObj.orderDetailsByOrderId(item.id);
        if (temp) {
          item.details = temp;
        } else {
          item.details = []
        }
      });
      await Promise.all(promises);
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
userOrders.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = userOrders;