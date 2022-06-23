/**
* Module specific to paymentmethods table
*/

const TABLE_NAME = "paymentmethods";
const FIELDS = {
    ID: "id",
    TYPE: `type`,
    STATUS: `status`,
}

let paymentMethods = {};

paymentMethods.SCHEMA = {
    TABLE_NAME,
    FIELDS
}

module.exports = paymentMethods;