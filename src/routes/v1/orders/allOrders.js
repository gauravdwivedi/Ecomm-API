const ApiError = require("../ApiError");
const {OrderDetails, Orders } = require("../../../core/sql/controller/child");
const axios = require("axios");

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
    // const OrderObj = new Orders(req._siteId);
    // const response = await OrderObj.paymentList();

    const response = await axios({
      method:'get',
      url:'https://api.razorpay.com/v1/payments?count=100',
      auth:{
        username:'rzp_test_0C9e0FJUuVdqGn',
        password:'VsKSMbeF4Aqgq5u9Ius7j59n'
      }
    })

    console.log('REAPONSEEE',response.data)
      req._response = response.data;
      next();

  }catch(err){
    console.log('Here?')
    req._response={};
    next();
  }
}

/**
 * Pending Orders COUNT
 */
allOrders.pendingOrders =async (req,res,next) =>{
  try{

    const orderObj = new Orders(req._siteId);
    const response = await orderObj.orderCount();
    req._response = response;
    next();
  }catch(err){
    console.log('Error',err)
    req._response={};
    next();
  }
}

allOrders.allPendingOrders = async (req,res,next) =>{
  try{
    const orderObj = new Orders(req._siteId);
    const response = await orderObj.allPendingOrders();
    req._response = response;
    next();
  }catch(err){
    console.log('Error',err)
    req._response={};
    next();
  }
}


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

allOrders.completedOrders = async (req,res,next) =>{
  try{
    const orderObj = new Orders(req._siteId);
      const res = await orderObj.completedOrderCount();
      req._response = res;
      next();

  }catch(err){
    req._response={};
    next();
  }
}



/**
 * Getting weekly Completed Orders where payment is successful
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
allOrders.weeklyCompletedOrders=async(req,res,next) =>{

try{

  const orderObj = new Orders(req._siteId);
  const res = await orderObj.weeklyCompletedOrders();
  req._response =res;
  next();

}catch(error){
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