/**
 * Module specific to states table
 */



 const TABLE_NAME = "states";
 const FIELDS={
     ID:"id",
     COUNTRYID:"country_id",
     NAME:"name",
     STATUS:"status"
 }
 
 let states={};
 
 states.SCHEMA ={
     TABLE_NAME,
     FIELDS
 }
 
 module.exports =states;
 