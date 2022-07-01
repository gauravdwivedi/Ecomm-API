/**
* Module specific to order_details table
*/

const TABLE_NAME = "order_details";
const FIELDS = {
    ID: "id",
    USER_ID: "userId",
    ORDER_ID: "orderId",
    VARIANT_ID: "variantId",
    PRODUCT_ID: "productId",
    QUANTITY: "quantity",
    PRICE: "price",
    UPDATED_AT: "updatedAt",
    CREATED_AT: "createdAt"
}

let orderDetails = {};

orderDetails.SCHEMA = {
    TABLE_NAME,
    FIELDS
}

module.exports = orderDetails;