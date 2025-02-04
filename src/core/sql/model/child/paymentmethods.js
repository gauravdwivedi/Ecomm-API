/**
* Module specific to paymentmethods table
*/

const TABLE_NAME = "paymentmethods";
const FIELDS = {
    ID: "id",
    TYPE: `type`,
    STATUS: `status`,
    CREATED_AT: "createdAt",
    UPDATED_AT: "updatedAt"
}

let paymentMethods = {};

paymentMethods.SCHEMA = {
    TABLE_NAME,
    FIELDS
}

module.exports = paymentMethods;