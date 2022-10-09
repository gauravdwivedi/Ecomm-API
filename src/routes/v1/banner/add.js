const ApiError = require("../ApiError");
const {Banner} = require("../../../core/sql/controller/child");


const addBanner={};


/**
 * validating request Body
 */
addBanner.validateRequest = async (req,res,next) =>{
    const { url,slug,title,description} = req.body;
    const userId = req._userId;
    req.body.userId = userId;
    if(!userId && url && slug&&title&&description) next(new ApiError(400,'E0010002', {}, 'Invalid request! Please check your inputs'));
    next();
}

/**
 * Saving in db
 */
addBanner.add =async(req,res,next) =>{
    try{
        const BannerObj = new Banner(req._siteId);
        const response = await BannerObj.addBanner(req.body);
        req._response =response;
        next();

    }catch(error){
        console.log(error)
        req._response={}
        next();
    }
}



/**
 * sending Response
 */
addBanner.sendResponse = async (req,res,next) =>{
    res.status(200).send({result:req._response});
    next();
}


module.exports = addBanner;