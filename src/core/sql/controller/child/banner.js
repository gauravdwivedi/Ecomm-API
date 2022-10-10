const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {v4 : uuidv4} = require('uuid')
const {
    Banner : { SCHEMA :{ FIELDS : BANNER_FIELDS, TABLE_NAME:BANNER_TABLE_NAME}}
} = require("../../model/child");


class Banner extends AbstractSQL{

    constructor(siteId){
        super(siteId);
        this.siteId=siteId;
        this.connection=super.connection();
    }


    /**
     * Add Banner
     */

    addBanner(params){
        let id=uuidv4();
        return new Promise((resolve,reject)=>{
            this.connection
            .query(QUERY_BUILDER.ADD_BANNER(id,params),super.getQueryType("INSERT"))
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
    }


    /**
     * Banner List
     */

    list(){
        
        return new Promise((resolve,reject)=>{
            this.connection
            .query(QUERY_BUILDER.BANNER_LIST(),super.getQueryType("SELECT"))
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
    }


    /**
     * Delete Banner
     */

     deleteBanner(id){
        return new Promise((resolve,reject)=>{
            this.connection
            .query(QUERY_BUILDER.DELETE_BANNER(id),super.getQueryType("DELETE"))
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
     }

     /**
      * Toggle Active
      */

     toggleActive(id){
        return new Promise((resolve,reject)=>{
            this.connection
            .query(QUERY_BUILDER.ACTIVE_TOGGLE(id),super.getQueryType("UPDATE"))
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>reject(error))
        })
     }

}

const QUERY_BUILDER={
    ADD_BANNER:(id,params)=>{
        let { slug,url,title,description}= params;
        const data ={
            [BANNER_FIELDS.ID]:id,
            [BANNER_FIELDS.SLUG]:slug,
            [BANNER_FIELDS.DESCRIPTION]:description,
            [BANNER_FIELDS.TITLE]:title,
            [BANNER_FIELDS.URL]:url,
            [BANNER_FIELDS.ACTIVE]:0
        }

        return SqlString.format(`INSERT INTO ${BANNER_TABLE_NAME} SET ?`,data)
    },

    BANNER_LIST:()=>{
        const query =`SELECT * FROM ${BANNER_TABLE_NAME}`;
        return SqlString.format(`SELECT * FROM ${BANNER_TABLE_NAME}`);
    },

    DELETE_BANNER:(id)=>{
       
        const query =`DELETE FROM ${BANNER_TABLE_NAME} WHERE ${BANNER_FIELDS.ID} =?`;
        return SqlString.format(query,id)
    },

    ACTIVE_TOGGLE:(id,status)=>{
        const query = `UPDATE ${BANNER_TABLE_NAME} SET ${BANNER_FIELDS.ACTIVE}=? WHERE ${BANNER_FIELDS.ID}=?`;
        return SqlString.format(query,status,id)
    }
}


module.exports=Banner;