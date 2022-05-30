const AbstractSQL = require('../abstract')
const SqlString = require("sqlstring")

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

addAddress(firstName,lastName, address, city, state, zipcode,userId,primary){
        
        return new Promise((resolve, reject) => {
            this.connection.query(QUERY_BUILDER.SAVE(firstName,lastName, address, city, state, zipcode,userId,primary),super.getQueryType('INSERT')).then(result => {
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
    SAVE:(firstName,lastName, address, city, state, zipcode,userId,add_primary,address_2) =>{

        const data = {
            [ADDRESS_FIELDS.FIRST_NAME] :firstName,
            [ADDRESS_FIELDS.LAST_NAME]:lastName,
            [ADDRESS_FIELDS.ADDRESS_1]:address,
            [ADDRESS_FIELDS.ADDRESS_2]:address_2||'',
            [ADDRESS_FIELDS.CITY]:city,
            [ADDRESS_FIELDS.STATE]:state,
            [ADDRESS_FIELDS.POSTCODE]:zipcode,
            [ADDRESS_FIELDS.USER_ID]:userId,
            [ADDRESS_FIELDS.ADD_PRIMARY]:add_primary||0
        }
        return SqlString.format(`INSERT INTO ${ADDRESS_TABLE_NAME} SET ?`,data)
    },

    LIST:(userId)=>{
      const query = `SELECT * FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.USER_ID} =?`;
      return SqlString.format(query,[userId])

    },

    EDIT:(params) =>{
        console.log('Params',params);
        const {id,firstName,lastName,address,city, state, zipcode,userId} = params;
        const query = `UPDATE ${ADDRESS_TABLE_NAME}
            SET ${ADDRESS_FIELDS.FIRST_NAME} = ? ,
            ${ADDRESS_FIELDS.LAST_NAME} = ? ,
            ${ADDRESS_FIELDS.ADDRESS_1} = ?,
            ${ADDRESS_FIELDS.CITY} = ? ,
            ${ADDRESS_FIELDS.STATE} = ? ,
            ${ADDRESS_FIELDS.POSTCODE} = ? 
            WHERE ${ADDRESS_FIELDS.ID} = ? AND ${ADDRESS_FIELDS.USER_ID} = ?`;

            const queryParams = [firstName,lastName,address,city,state,zipcode,id,userId];
            const res = SqlString.format(query,queryParams)
            return res;
    }
}

module.exports =Address;