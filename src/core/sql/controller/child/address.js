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
    SAVE:(firstName,lastName, address, city, state, zipcode,userId,primary,address_2) =>{

        const data = {
            [ADDRESS_FIELDS.FIRST_NAME] :firstName,
            [ADDRESS_FIELDS.LAST_NAME]:lastName,
            [ADDRESS_FIELDS.ADDRESS_1]:address,
            [ADDRESS_FIELDS.ADDRESS_2]:address_2||'',
            [ADDRESS_FIELDS.CITY]:city,
            [ADDRESS_FIELDS.STATE]:state,
            [ADDRESS_FIELDS.POSTCODE]:zipcode,
            [ADDRESS_FIELDS.USER_ID]:userId,
            [ADDRESS_FIELDS.PRIMARY]:primary||0
        }
        return SqlString.format(`INSERT INTO ${ADDRESS_TABLE_NAME} SET ?`,data)
    },

    LIST:(userId)=>{
      const query = `SELECT * FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.USER_ID} =?`;
      return SqlString.format(query,[userId])

    },

    EDIT:(params) =>{

        console.log('PRAMS',params)
            let {firstName,lastName, address, city, state, zipcode,userId,primary,address_2} = params;
            let values =[];
            let query = `UPDATE ${ADDRESS_TABLE_NAME} `;
            if(firstName){
                query += ` SET ${ADDRESS_FIELDS.FIRST_NAME} = ?`;
                values.push(firstName);
            }

            if(lastName){
                query += `, ${ADDRESS_FIELDS.LAST_NAME} = ?`;
                values.push(lastName);
            }


            if(address){
                query += `, ${ADDRESS_FIELDS.ADDRESS_1} = ?`;
                values.push(address);
            }


            if(city){
                query += `, ${ADDRESS_FIELDS.CITY} = ?`;
                values.push(city);
            }


            if(state){
                query += `,${ADDRESS_FIELDS.STATE} = ?`;
                values.push(state);
            }


            if(zipcode){
                query += `, ${ADDRESS_FIELDS.POSTCODE} = ?`;
                values.push(zipcode);
            }


            if(primary){
                query += `, ${ADDRESS_FIELDS.PRIMARY} = ?`;
                values.push(primary);
            }

            query += ` WHERE ${ADDRESS_FIELDS.USER_ID} = ? `;
            values.push(userId)

            // query += `AND ${ADDRESS_FIELDS.ID} = ?`;
            // values.push(id);
        


        return SqlString.format(query,values);
    }
}

module.exports =Address;