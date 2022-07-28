
const TABLE_NAME = "cities";
const FIELDS={
    ID:"id",
    STATEID:"state_id",
    NAME:"name",
    STATUS:"status"
}

let cities={};

cities.SCHEMA ={
    TABLE_NAME,
    FIELDS
}

module.exports =cities;
