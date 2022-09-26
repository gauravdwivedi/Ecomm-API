const ApiError = require("../ApiError");
const {OrderDetails, Orders } = require("../../../core/sql/controller/child");

const allOrders = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
allOrders.validateRequest = async(req, res, next) => {
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
allOrders.orders = async(req, res, next) => {
  try {
    const OrdersObj = new Orders(req._siteId);
    const response = await OrdersObj.allOrders();
    // const promises = response.map(async (item) => {
    //   const OrderDetailsObj = new OrderDetails(req._siteId);
    //   let temp = await OrderDetailsObj.orderDetailsByOrderId(item.id);
    //   if (temp) {
    //     item.details = temp;
    //   } else {
    //     item.details = []
    //   }
    // });
    // await Promise.all(promises);
    console.log('Response ==>',response)
    req._response = response;
    next();
  } catch(err) {
    console.log(err);
    req._response = {};
    next();
  }
}


allOrders.changeStatus= async (req,res,next) =>{
  try{
    const {orderId,new_status} =req;
    const ordersObj =new Orders(req._siteId);
    const response = await ordersObj.changeOrderStatus()

  }catch(err){
    console.log(err);
    req._response ={};
    next();
  }
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
allOrders.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  // next();
}

module.exports = allOrders;