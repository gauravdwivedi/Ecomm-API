const ApiError = require("../ApiError");
const {OrderDetails, Orders } = require("../../../core/sql/controller/child");

const details = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
details.validateRequest = async(req, res, next) => {
    const {id } = req.params;
    if(!( id)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
details.order = async(req, res, next) => {
  try {
    const {id } = req.params;
    const OrderObj = new Orders(req._siteId);
    const OrderDetailsObj = new OrderDetails(req._siteId);
    const response = await OrderObj.orderDetailsById(id);
    if(response){
        response.details = await OrderDetailsObj.orderDetailsByOrderId(id);
        req._response = response;
    }else{
        req._response =[]
    }
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
details.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = details;