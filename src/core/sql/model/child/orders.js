/**
* Module specific to orders table
*/

const TABLE_NAME = "orders";
const FIELDS = {
    ID: "id",
    USER_ID: "userid",
    RAZORPAY_ORDER_ID: "razorpayOrderId",
    STATUS: "status",
    DELIVERY_STATUS: "deliveryStatus",
    ADDRESS_ID: "addressId",
    PRICE_BEFORE_TAX: "priceBeforeTax",
    PRICE_AFTER_TAX: "priceAfterTax",
    DISCOUNT: "discount",
    NOTES: "notes",
    TAX: "tax",
    CREATED_AT: "createdAt",
    UPDATED_AT: "updated_at"
}

let orders = {};

orders.SCHEMA = {
    TABLE_NAME,
    FIELDS
}

module.exports = orders;