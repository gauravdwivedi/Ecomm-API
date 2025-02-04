const ApiError = require("../ApiError");
const { OrderDetails,Orders, Cart } = require("../../../core/sql/controller/child");
const Razorpay = require("razorpay");
const { Hmac, createHmac } = require("crypto");
const paymentOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
paymentOrder.validateRequest = async (req, res, next) => {
    const { razorPayPaymentId ,razorPaySignature } = req.body;
    const userId = req._userId;
    req.body.userId = userId;
    if (!( userId && razorPayPaymentId  && razorPaySignature)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
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
        const userId = req._userId;
        const OrdersObj = new Orders(req._siteId);
        const CartObj = new Cart(req._siteId);

        var instance = new Razorpay({ key_id: process.env['RAZORPAY:KEY_ID'], key_secret: process.env['RAZORPAY:KEY_SECRET'] })
        let paymentObj = await instance.payments.fetch(req.body.razorPayPaymentId)
        const order = await OrdersObj.latestOrder({userId : req.body.userId , status: "pending",method:"razorpay" });
        if (order && paymentObj) {
            const {invoice_id,order_id,status} = paymentObj;
            const {razorPayPaymentId,  razorPaySignature} = req.body;
            
            if(status ==="captured"){

                //Step :1
                //Verify Payment Signature
                const generated_sig =createHmac('sha256',process.env['RAZORPAY:KEY_SECRET'])
                                        .update(order_id+"|"+razorPayPaymentId)
                                        .digest('hex')


                //STEP 2
                    if(generated_sig == razorPaySignature){
                        console.log('SIG',generated_sig,'RasorPay Sig',razorPaySignature);

                        const OrderDetailsObj = new OrderDetails(req._siteId);
                        let orderDetails = await OrderDetailsObj.orderDetailsByOrderId(order.id);
                        const promises = orderDetails.map(async (item) => {
                            await OrdersObj.quantityUpdate({id: item.variantId ,  qty: item.quantity})
                            await CartObj.deleteItems(item.variantId,userId);
                        });
                        await Promise.all(promises);
                        await OrdersObj.orderStatusUpdate({id:order.id , status: "success"});
                    }else{
                        let resp ='Payment signature does not match';

                        req._response = resp;
                        next();
                    }
                
            }else{
                await OrdersObj.orderStatusUpdate({id:order.id , status})
            }
            let param  = {razorPayPaymentId,  razorPaySignature,razorPayInvoiceId:invoice_id || "",razorpayOrderId: order_id,status, orderId:order.id,methodId:order.methodId}
            const response = await OrdersObj.payment(param);
            const addressId = await OrdersObj.addressIdByPaymentId(response);
            console.log('Address ID',addressId)

                let resp = { status, response,addressId: addressId.addressId}
            req._response = resp;
            next();
        }else if(!order){
            return next(new ApiError(400, 'E0010007'));
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