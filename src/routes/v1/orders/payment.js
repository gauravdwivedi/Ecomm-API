const ApiError = require("../ApiError");
const { Orders } = require("../../../core/sql/controller/child");

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
            const variant = await OrdersObj.variantsByVariantId(order.variantId);
            let paymentData = {...req.body,orderId:order.id,methodId:order.methodId};
            let qty = Number(variant.qty_in_stock) - (Number(order.quantity))
            const response = await OrdersObj.payment(paymentData);
            await OrdersObj.quantityUpdate({id:order.variantId,qty})
            await OrdersObj.orderStatusUpdate({id:order.id , status: "complete"})
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