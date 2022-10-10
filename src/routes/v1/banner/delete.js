const ApiError = require("../ApiError");
const { Banner} = require("../../../core/sql/controller/child");


const deleteBanner ={};


/**
 * Validating Body
 */
deleteBanner.validateBody =async (req,res,next) =>{
    const { id} =req.body;

    if(!id) next(new ApiError(400,'E0010002', {}, 'Invalid request! Please check your inputs'));
    next();
}


/**
 * Saving in DB
 */

deleteBanner.delete =async (req,res,next) =>{
    try{    
        const {id} =req.body;

        const BannerObj = new Banner(req._siteId);
        const response = await BannerObj.deleteBanner(id);
        req._response=response;
        next();

    }catch(error){
        req._response={};
        next();
    }
}

/**
 * sending Response
 */
deleteBanner.sendResponse = async (req,res,next) =>{
    res.status(200).send({result:req._response});
    next();
}


module.exports = deleteBanner;