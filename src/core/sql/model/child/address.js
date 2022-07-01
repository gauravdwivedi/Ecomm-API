

const TABLE_NAME ="address";
const FIELDS ={

    ID:"id",
    USER_ID:"userId",
    ADD_PRIMARY:"addPrimary",
    ADDRESS_1:"address1",
    ADDRESS_2:"address2",
    CITY:"city",
    POSTCODE:"postcode",
    STATE:"state",
    COUNTRY:"country",
    FIRST_NAME:"firstName",
    LAST_NAME:"lastName",
    LONGITUDE:"longitude",
    LATITUDE:"latitude",
    CREATED_AT: "createdAt",
    UPDATED_AT: "updatedAt"
}

let address ={};

address.SCHEMA ={
    TABLE_NAME,
    FIELDS
}

module.exports =address