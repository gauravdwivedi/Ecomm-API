/**
 * Module specific to banner table
 */


const TABLE_NAME="banner";
const FIELDS={
    ID:"id",
    URL:"url",
    TITLE:"title",
    SLUG:"slug",
    DESCRIPTION:"description",
    ACTIVE:"active"
}

let banner ={};

banner.SCHEMA ={
    TABLE_NAME,
    FIELDS
}


module.exports = banner;