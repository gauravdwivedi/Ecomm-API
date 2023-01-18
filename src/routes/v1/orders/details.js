const ApiError = require("../ApiError");
const {OrderDetails, Orders,Address } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
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
 * Fetching All Order Details by orderID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

details.adminOrderDetail= async (req,res,next) =>{
  try{
    console.log('ADMIN Order Detail');
  const {id} = req.params;
  const OrderObj = new Orders(req._siteId);
  const OrderDetailsObj = new OrderDetails(req._siteId);  
  const addressObj = new Address(req._siteId);


  const response = await OrderObj.orderDetailsById(id);
  console.log('OrderDetailsByID',response)

  const addressId =response.addressId;
  console.log(addressId);

  const address = await addressObj.addressById(addressId)
  console.log('Address',address)
  

  res.status(200).send(base.success({result:{...response,address}}));
  
    
  }catch(err){
    res.status(200).send(base.success({result: {}}));
    
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