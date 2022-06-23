const AbstractSQL = require('../abstract')
const SqlString = require("sqlstring")
const {v4 : uuidv4} = require('uuid')
const {
    Address : { SCHEMA :{ FIELDS : ADDRESS_FIELDS, TABLE_NAME:ADDRESS_TABLE_NAME}}
} = require("../../model/child");

class Address extends AbstractSQL {
    constructor(siteId){
        super(siteId);
        this.siteId =siteId;
        this.connection = super.connection();
    }

    /**
     * Add Address
     */

addAddress(firstName,lastName, address, city, state, zipcode,userId,primary,longitude,latitude){
        
        return new Promise((resolve, reject) => {
            this.connection.query(QUERY_BUILDER.SAVE(firstName,lastName, address, city, state, zipcode,userId,primary,longitude,latitude),super.getQueryType('INSERT')).then(result => {
                resolve(result);
            }).catch(error => resolve(error));
        })
    }

    editAddress(params){
        return new Promise((resolve,reject) =>{
            this.connection.query(QUERY_BUILDER.EDIT(params), super.getQueryType('UPDATE')).then(result =>{
                resolve(result)
            }).catch(error =>resolve(error))
        })
    }

list(userId){
        return new Promise((resolve,reject)=>{
            this.connection.query(QUERY_BUILDER.LIST(userId),super.getQueryType('SELECT')).then(result=>{
                    resolve(result);
                }).catch(error => resolve(error));
            })
        }
    }


const QUERY_BUILDER = {
    SAVE:(firstName,lastName, address, city, state, zipcode,userId,add_primary,longitude,latitude) =>{
        // address_2
        const data = {
            [ADDRESS_FIELDS.FIRST_NAME] :firstName,
            [ADDRESS_FIELDS.LAST_NAME]:lastName,
            [ADDRESS_FIELDS.ADDRESS_1]:address,
            [ADDRESS_FIELDS.CITY]:city,
            [ADDRESS_FIELDS.STATE]:state,
            [ADDRESS_FIELDS.POSTCODE]:zipcode,
            [ADDRESS_FIELDS.USER_ID]:userId,
            [ADDRESS_FIELDS.LONGITUDE]:longitude,
            [ADDRESS_FIELDS.LATITUDE]:latitude,
            [ADDRESS_FIELDS.ADD_PRIMARY]:add_primary||0
        }
        return SqlString.format(`INSERT INTO ${ADDRESS_TABLE_NAME} SET ${ [ADDRESS_FIELDS.ID]} = ${uuidv4()} , ?`,data)
    },

    LIST:(userId)=>{
      const query = `SELECT * FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.USER_ID} =?`;
      return SqlString.format(query,[userId])

    },

    EDIT:(params) =>{
        console.log('Params',params);
        const {id,firstName,lastName,address,city, state, zipcode,userId,longitude,latitude} = params;
        const query = `UPDATE ${ADDRESS_TABLE_NAME}
            SET ${ADDRESS_FIELDS.FIRST_NAME} = ? ,
            ${ADDRESS_FIELDS.LAST_NAME} = ? ,
            ${ADDRESS_FIELDS.ADDRESS_1} = ?,
            ${ADDRESS_FIELDS.CITY} = ? ,
            ${ADDRESS_FIELDS.STATE} = ? ,
            ${ADDRESS_FIELDS.POSTCODE} = ? ,
            ${ADDRESS_FIELDS.LONGITUDE} = ? ,
            ${ADDRESS_FIELDS.LATITUDE} = ? 
            WHERE ${ADDRESS_FIELDS.ID} = ? AND ${ADDRESS_FIELDS.USER_ID} = ?`;

            const queryParams = [firstName,lastName,address,city,state,zipcode,longitude,latitude,id,userId];
            const res = SqlString.format(query,queryParams)
            return res;
    }
}

module.exports =Address;