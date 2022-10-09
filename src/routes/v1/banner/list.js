const ApiError =require("../ApiError");
const { Banner} = require("../../../core/sql/controller/child");


const bannerList ={};


bannerList.list=async (req,res,next) =>{
    
    try{

        const bannerObj =new Banner(req._siteId);
        const response = await bannerObj.list();

        req._response= response;
        next();

    }catch(error){
        req._response={}
        next();
    }

}

/**
 * sending response
 */
bannerList.sendResponse =async (req,res,next) =>{
    res.status(200).send({result:req._response});
    next();
}

module.exports=bannerList;