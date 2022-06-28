/**
* Module specific to payments table
*/

const TABLE_NAME = "payments";
const FIELDS = {
    ID: "id",
    INVOICE_ID: `invoiceId`,
    RAZOR_PAY_ORDER_ID: `razorpayOrderId`,
    ORDER_ID: `orderId`,
    PAYMENT_METHOD_ID: `paymentMethodId`,
    PAYMENT_STATUS: `paymentStatus`,
    RAZOR_PAY_PAYMENT_ID: `razorPayPaymentId`,
    RAZOR_PAY_SIGNATURE: `razorPaySignature`,
    CREATED_AT: "createdAt",
    UPDATED_AT: "updated_at"
}

let payments = {};

payments.SCHEMA = {
    TABLE_NAME,
    FIELDS
}

module.exports = payments;