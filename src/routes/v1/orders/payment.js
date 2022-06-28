const ApiError = require("../ApiError");
const { OrderDetails,Orders } = require("../../../core/sql/controller/child");

const paymentOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
paymentOrder.validateRequest = async (req, res, next) => {
    const { id , order_id, invoice_id, status} = req.body;
    const userId = req._userId;
    req.body.userId = userId;
    if (!( id  && order_id  && status)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
    next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
paymentOrder.payment = async (req, res, next) => {
    try {
        const OrdersObj = new Orders(req._siteId);
        const order = await OrdersObj.latestOrder({userId : req.body.userId , status: "pending",method:"razorpay" });
        if (order) {
            let paymentData = {...req.body,orderId:order.id,methodId:order.methodId};
            const response = await OrdersObj.payment(paymentData);
            if(req.body.status ==="failed"){
                await OrdersObj.orderStatusUpdate({id:order.id , status: "failed"})
            }else if(req.body.status ==="captured"){
                const OrderDetailsObj = new OrderDetails(req._siteId);
                let orderDetails = await OrderDetailsObj.orderDetailsByOrderId(order.id);
                const promises = orderDetails.map(async (item) => {
                    await OrdersObj.quantityUpdate({id: item.variantId ,  qty: item.quantity})
                });
                await Promise.all(promises);
                await OrdersObj.orderStatusUpdate({id:order.id , status: "success"})
            }
            
            req._response = response;
            next();
        } else {
            return next(new ApiError(400, 'E0010002'));
        }
    } catch (err) {
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
paymentOrder.sendResponse = async (req, res, next) => {
    res.status(200).send({ result: req._response });
    next();
}

module.exports = paymentOrder;