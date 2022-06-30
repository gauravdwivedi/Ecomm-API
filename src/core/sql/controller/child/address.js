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
        let id = uuidv4();
        return new Promise((resolve, reject) => {
            this.connection.query(QUERY_BUILDER.SAVE(id, firstName,lastName, address, city, state, zipcode,userId,primary,longitude,latitude),super.getQueryType('INSERT')).then(result => {
                resolve(id);
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

    removePrimaryAddress(id){
        return new Promise((resolve,reject) =>{
            this.connection.query(QUERY_BUILDER.REMOVE_PRIMARY_ADDRESS(id), super.getQueryType('UPDATE')).then(result =>{
                resolve(result)
            }).catch(error =>resolve(error))
        })
    }

    makePrimaryAddress(id){
        return new Promise((resolve,reject) =>{
            this.connection.query(QUERY_BUILDER.MAKE_PRIMARY_ADDRESS(id), super.getQueryType('UPDATE')).then(result =>{
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


        addressById(id){
            return new Promise((resolve,reject)=>{
                this.connection.query(QUERY_BUILDER.ADDRESS_BY_ID(id),super.getQueryType('SELECT')).then(result=>{
                        resolve(result);
                    }).catch(error => resolve(error));
                })
            }    


    }


const QUERY_BUILDER = {
    SAVE:(id, firstName,lastName, address, city, state, zipcode,userId,add_primary,longitude,latitude) =>{
        // address_2
        const data = {
            [ADDRESS_FIELDS.ID] :id,
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
        return SqlString.format(`INSERT INTO ${ADDRESS_TABLE_NAME} SET ?`,data)
    },

    LIST:(userId)=>{
      const query = `SELECT * FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.USER_ID} =?`;
      return SqlString.format(query,[userId])

    },

    EDIT:(params) =>{
        console.log('Params',params);
        const {id,firstName,lastName,address,city, state, zipcode,primary,userId,longitude,latitude} = params;
        const query = `UPDATE ${ADDRESS_TABLE_NAME}
            SET ${ADDRESS_FIELDS.FIRST_NAME} = ? ,
            ${ADDRESS_FIELDS.LAST_NAME} = ? ,
            ${ADDRESS_FIELDS.ADDRESS_1} = ?,
            ${ADDRESS_FIELDS.CITY} = ? ,
            ${ADDRESS_FIELDS.STATE} = ? ,
            ${ADDRESS_FIELDS.POSTCODE} = ? ,
            ${ADDRESS_FIELDS.LONGITUDE} = ? ,
            ${ADDRESS_FIELDS.LATITUDE} = ? , 
            ${ADDRESS_FIELDS.ADD_PRIMARY} = ?  
            WHERE ${ADDRESS_FIELDS.ID} = ? AND ${ADDRESS_FIELDS.USER_ID} = ?`;

            const queryParams = [firstName,lastName,address,city,state,zipcode,longitude,latitude,primary,id,userId];
            const res = SqlString.format(query,queryParams)
            return res;
    },

    REMOVE_PRIMARY_ADDRESS:(userId) =>{
        console.log('userId',userId);
        const query = `UPDATE ${ADDRESS_TABLE_NAME} SET ${ADDRESS_FIELDS.ADD_PRIMARY} = 0 WHERE ${ADDRESS_FIELDS.USER_ID} = ? `;

            const queryParams = [userId];
            const res = SqlString.format(query,queryParams)
            return res;
    },

    MAKE_PRIMARY_ADDRESS:(id) =>{
        console.log('id',id);
        const query = `UPDATE ${ADDRESS_TABLE_NAME} SET ${ADDRESS_FIELDS.ADD_PRIMARY} = 1 WHERE ${ADDRESS_FIELDS.ID} = ? `;

            const queryParams = [id];
            const res = SqlString.format(query,queryParams)
            return res;
    },

    ADDRESS_BY_ID:(id) =>{
        console.log('EXEcuting Address by id',id)
        const query = ` SELECT * FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.ID} = ?`;
        return SqlString.format(query,[id])
    }

}

module.exports =Address;