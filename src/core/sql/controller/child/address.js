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

    addAddress(firstName,lastName, address, city, state,country, zipcode,userId,primary,longitude,latitude,colony, landmark){
        let id = uuidv4();
        return new Promise((resolve, reject) => {
            this.connection.query(QUERY_BUILDER.SAVE(id, firstName,lastName, address, city, state,country, zipcode,userId,primary,longitude,latitude,colony, landmark),super.getQueryType('INSERT')).then(result => {
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

    checkUserAddress(userId){
        return new Promise((resolve,reject) =>{
            this.connection.query(QUERY_BUILDER.CHECK_USER_ADDRESS(userId), super.getQueryType('SELECT')).then(result =>{
                resolve(result[0])
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
            
countrylist(){
    return new Promise((resolve,reject)=>{
        this.connection.query(QUERY_BUILDER.COUNTRY_LIST(),super.getQueryType('SELECT')).then(result=>{
            resolve(result);
        }).catch(error => resolve(error));
    })
}            


getStateByCountry(id){
    return new Promise((resolve,reject)=>{
        this.connection.query(QUERY_BUILDER.GET_STATE_BY_COUNTRY(id),super.getQueryType('SELECT')).then(result=>{
            console.log('States',result);
            resolve(result);
        }).catch(error=>resolve(error));
    })
}

getCitiesByState(id){
    return new Promise((resolve,reject)=>{
        this.connection.query(QUERY_BUILDER.GET_CITIES_BY_STATE(id),super.getQueryType('SELECT')).then(result=>{
            resolve(result);
        }).catch(error=> resolve(error));
    })
}

 }


const QUERY_BUILDER = {
    SAVE:(id, firstName,lastName, address, city, state,country, zipcode,userId,add_primary,longitude,latitude,colony, landmark) =>{
        // address_2
        const data = {
            [ADDRESS_FIELDS.ID] :id,
            [ADDRESS_FIELDS.FIRST_NAME] :firstName,
            [ADDRESS_FIELDS.LAST_NAME]:lastName,
            [ADDRESS_FIELDS.ADDRESS_1]:address,
            [ADDRESS_FIELDS.CITY]:city,
            [ADDRESS_FIELDS.STATE]:state,
            [ADDRESS_FIELDS.COUNTRY]:country,
            [ADDRESS_FIELDS.POSTCODE]:zipcode,
            [ADDRESS_FIELDS.USER_ID]:userId,
            [ADDRESS_FIELDS.LONGITUDE]:longitude,
            [ADDRESS_FIELDS.LATITUDE]:latitude,
            [ADDRESS_FIELDS.COLONY]:colony,
            [ADDRESS_FIELDS.LANDMARK]:landmark,
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
        const {id,firstName,lastName,address,city, state, zipcode,primary,userId,longitude,latitude, colony, landmark} = params;
        const query = `UPDATE ${ADDRESS_TABLE_NAME}
            SET ${ADDRESS_FIELDS.FIRST_NAME} = ? ,
            ${ADDRESS_FIELDS.LAST_NAME} = ? ,
            ${ADDRESS_FIELDS.ADDRESS_1} = ?,
            ${ADDRESS_FIELDS.CITY} = ? ,
            ${ADDRESS_FIELDS.STATE} = ? ,
            ${ADDRESS_FIELDS.POSTCODE} = ? ,
            ${ADDRESS_FIELDS.LONGITUDE} = ? ,
            ${ADDRESS_FIELDS.LATITUDE} = ? , 
            ${ADDRESS_FIELDS.COLONY} = ? , 
            ${ADDRESS_FIELDS.LANDMARK} = ? , 
            ${ADDRESS_FIELDS.ADD_PRIMARY} = ?  
            WHERE ${ADDRESS_FIELDS.ID} = ? AND ${ADDRESS_FIELDS.USER_ID} = ?`;

            const queryParams = [firstName,lastName,address,city,state,zipcode,longitude,latitude, colony, landmark,primary,id,userId];
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

    CHECK_USER_ADDRESS:(userId) =>{
        console.log('userId',userId)
        const query = ` SELECT COUNT(*) AS Total  FROM ${ADDRESS_TABLE_NAME} WHERE ${ADDRESS_FIELDS.USER_ID} = ? `;
        return SqlString.format(query,[userId])
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
    },

    COUNTRY_LIST:() =>{
        const query = `SELECT * FROM countries ORDER BY id desc`;
        return SqlString.format(query);
    },

    GET_STATE_BY_COUNTRY:(id)=>{
        const query = `SELECT * FROM states WHERE country_id = ? `;
        return SqlString.format(query,[id])
    },

    GET_CITIES_BY_STATE:(id)=>{
        const query = `SELECT * FROM cities WHERE state_id= ?`;
        return SqlString.format(query,[id]);
    }

}

module.exports =Address;