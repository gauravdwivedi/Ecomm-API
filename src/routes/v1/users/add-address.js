const { Address} = require("../../../core/sql/controller/child")
const ApiError = require("../ApiError");


const address ={};

address.validateRequest = async(req,res,next) =>{
    console.log(req.body)
    const { firstName,lastName, address, city,state,zipcode,longitude,latitude, colony, landmark} = req.body;
    console.log('ZIPCODE',zipcode)
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

    if(isNaN(zipcode)){
        return next(new ApiError(400, 'E0010009'));
    }

    // if(!longitude){
    //     return next(new ApiError(400, 'E001004'));
    // }

    // if(!latitude){
    //     return next(new ApiError(400, 'E001004'));
    // }
    
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

        let { firstName,lastName, address, city, state,country, zipcode,primary,longitude,latitude,colony, landmark} = req.body;
        const AddObj = new Address(req._siteId);
        if(primary == 1) await AddObj.removePrimaryAddress(req._userId);
        let checkAddress = await AddObj.checkUserAddress(req._userId);
        if(checkAddress.Total === 0) primary = 1;
      const response = await AddObj.addAddress(firstName,lastName,address,city,state,country,zipcode,req._userId,primary,longitude,latitude,colony, landmark)
      console.log(response)
      req._response = response

        next();

    }catch(err){
        console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
    }

}

address.list = async(req,res,next) =>{
    try{    

          const listAddObj = new Address(req._siteId);
          const response = await listAddObj.list(req._userId)  

          req._response =response
          next();

    }catch(err){
        console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
    }
}

address.edit = async (req,res,next) =>{
    try{
        let { id,firstName,lastName, address, city, state, zipcode,primary,longitude,latitude,colony, landmark,} = req.body;
        
        let params ={
           id, firstName,lastName,address,city,state,zipcode,primary:primary||0,longitude,latitude,colony, landmark,
            userId:req._userId
        }

        const listEditAddObj = new Address(req._siteId);
        if(primary == 1) await listEditAddObj.removePrimaryAddress(req._userId);
        const response = await listEditAddObj.editAddress(params)
        req._response = response;
        next();
        

    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}

address.makePrimary = async (req,res,next) =>{
    try{
        let { id} = req.body;

        const listEditAddObj = new Address(req._siteId);
        await listEditAddObj.removePrimaryAddress(req._userId);
        const response = await listEditAddObj.makePrimaryAddress(id)
        req._response = response;
        next();
    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}
address.countryList =async (req,res,next) =>{
    try{

        const AddObj = new Address(req._siteId);
        const result  = await AddObj.countrylist();
        console.log(result)
        req._response =result;
        next();

    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}

address.getStatesByCountry =async (req,res,next) =>{
    try{
        let {id}= req.body;
        const AddObj = new Address(req._siteId);
        const result = await AddObj.getStateByCountry(id)
            
        req._response =result;
        next();
        
    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}

address.getCitiesByState =async (req,res,next) =>{
    try{

        let {id}= req.body;
        const AddObj = new Address(req._siteId);
        const result = await AddObj.getCitiesByState(id)
            console.log(result)
        req._response =result;
        next();
        
    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}


address.addressDetailById = async (req,res,next) =>{
    try{

        let { addressId } = req.body;
        if(addressId){
        const addDetailObj = new Address(req._siteId);
        const address = await addDetailObj.addressById(addressId);
        console.log('Address Detail',address)
        req._response =address;
        next();
        }

        // return next(new ApiError(500,'E0010001',{},'There was some problem!'));
        next();


    }catch(err){
        return next(new ApiError(500,'E0010001',{},'There was some problem!'));
    }
}
address.sendResponse = async(req, res, next) => {
    res.status(200).send({result: req._response});
    next();
  }

module.exports = address