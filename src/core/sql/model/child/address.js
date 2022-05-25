

const TABLE_NAME ="address";
const FIELDS ={

    ID:"id",
    USER_ID:"user_id",
    PRIMARY:"primary",
    ADDRESS_1:"address_1",
    ADDRESS_2:"address_2",
    CITY:"city",
    POSTCODE:"postcode",
    STATE:"state",
    COUNTRY:"country",
    FIRST_NAME:"first_name",
    LAST_NAME:"last_name"
}

let address ={};

address.SCHEMA ={
    TABLE_NAME,
    FIELDS
}

module.exports =address