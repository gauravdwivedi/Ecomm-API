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
    // console.log('Response ==>',response)
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
    console.log('BODYDDDD',req.body);
    let { id,status}= req.body;
    const OrdersObj = new Orders(req._siteId);
    const response = await OrdersObj.orderStatusUpdate({id,status});
    console.log(response);
    req._response = response;
    next();
  }catch(err){
    console.log(err);
    req._response ={};
    next();
  }
}

allOrders.transactions = async (req,res,next) =>{
  try{
    console.log('Transactions')
    const OrderObj = new Orders(req._siteId);
    const response = await OrderObj.paymentList();
      req._response = response;
      next();

  }catch(err){
    console.log('Here?')
    req._response={};
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
  console.log('Response')
  res.status(200).send({result: req._response});
  // next();
}

module.exports = allOrders;