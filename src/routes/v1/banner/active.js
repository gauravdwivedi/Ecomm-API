const ApiError =require("../ApiError");
const { Banner}= require("../../../core/sql/controller/child");


const activeBanner={};



/**
 * validating request Body
 */

activeBanner.validateRequest = async (req,res,next) =>{
    const { id} =req.body;

    if(!id) next(new ApiError(400,'E0010002', {}, 'Invalid request! Please check your inputs'))
    next();
}


/**
 * Changes in db
 */
activeBanner.active = async (req,res,next) =>{
   try{

    const {id,activeStatus} = req.body;
    const BannerObj = new Banner(req._siteId);
    const response = await BannerObj.toggleActive(id,activeStatus);
    req._response = response;
    next();

   }catch(error){
    console.log(error)
    req._response={}
    next();
   }
}

/**
 * Sending Repsonse
 */

activeBanner.sendResponse = async (req,res,next) =>{
    res.status(200).send({result:req._response});
    next();
}


module.exports = activeBanner;