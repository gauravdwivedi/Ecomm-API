/**
 * Module specific to countries table
 */


const TABLE_NAME = "countries";
const FIELDS={
    ID:"id",
    NAME:"name",
    STATUS:"status"
}

let countries={};

countries.SCHEMA ={
    TABLE_NAME,
    FIELDS
}

module.exports =countries;
