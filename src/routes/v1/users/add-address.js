const { Address} = require("../../../core/sql/controller/child")
const ApiError = require("../ApiError");


const address ={};



address.validateRequest = async(req,res,next) =>{
    console.log(req.body)
    const { firstName,lastName, address, city,state,zipcode} = req.body;

    if(typeof  firstName !== 'string'|| firstName.length>100){
        return next(new ApiError(400, 'E001004'));
    }

    if(typeof lastName !== 'string'|| lastName.length>100){
        return next(new ApiError(400, 'E001004'));
    }

    if(!address){
        return next(new ApiError(400, 'E001004'));
    }

    if(!city){
        return next(new ApiError(400, 'E001004'));
    }

    if(!state){
        return next(new ApiError(400, 'E001004'));
    }

    if(!zipcode){
        return next(new ApiError(400, 'E001004'));
    }

    next();

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
address.addAddress = async(req,res,next) => {
    console.log('REQUEST',req.body)
    try{

        let { firstName,lastName, address, city, state, zipcode,primary} = req.body;
        const AddObj = new Address(req._siteId);
      const response = await AddObj.addAddress(firstName,lastName,address,city,state,zipcode,req._userId,primary)
      console.log(response)
      req._response = response

        next();

    }catch(err){
        console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
    }

}

address.sendResponse = async(req, res, next) => {
    res.status(200).send({result: req._response});
    next();
  }

module.exports = address