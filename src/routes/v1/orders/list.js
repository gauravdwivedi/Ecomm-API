const ApiError = require("../ApiError");
const {OrderDetails, Orders } = require("../../../core/sql/controller/child");

const list = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
list.validateRequest = async(req, res, next) => {
  console.log(req.body)
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
list.orders = async(req, res, next) => {
  try {
    const userId = req._userId;
    const OrdersObj = new Orders(req._siteId);
    const response = await OrdersObj.orders(userId);
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
list.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  // next();
}

module.exports = list;