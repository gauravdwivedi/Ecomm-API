const ApiError = require("../ApiError");
const { OrderDetails, Orders } = require("../../../core/sql/controller/child");
const { validate: isValidUUID } = require('uuid')

const newOrder = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
newOrder.validateRequest = async (req, res, next) => {
  const { addressId, data } = req.body;
  const userId = req._userId;
  req.body.userId = userId;
  if (!(userId && addressId && data)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
newOrder.new = async (req, res, next) => {
  try {
    const { userId, addressId, data } = req.body;
    const OrdersObj = new Orders(req._siteId);
    const OrderDetailsObj = new OrderDetails(req._siteId);
    let newPrice = 0;
    let notes = req.body.notes
    let param = { userid: userId, addressId, notes, status: "pending", deliveryStatus: "processing", priceBeforeTax: 0, priceAfterTax: 0, discount: 0, tax: 0 }
    const response = await OrdersObj.newOrder(param);
    if (isValidUUID(response)) {
      const promises = data.map(async (item) => {
        let product = await OrdersObj.variantsByVariantId(item.variantId);
        if (product) {
          item.price = product.price;
          item.userid = userId;
          item.orderId = response;
          newPrice = newPrice + Number(product.price);
          await OrderDetailsObj.save(item);
        }
      });
      await Promise.all(promises);

      await OrdersObj.orderPriceUpdate({ id: response, priceBeforeTax: newPrice, priceAfterTax: newPrice })

      req._response = response;
      next();
    } else {
      return next(new ApiError(400, 'E0010006'));
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
newOrder.sendResponse = async (req, res, next) => {
  res.status(200).send({ result: req._response });
  next();
}

module.exports = newOrder;