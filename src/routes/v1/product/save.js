const ApiError = require("../ApiError");
const { ProductSave } = require("../../../core/sql/controller/child");

const save = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
save.validateRequest = async(req, res, next) => {
  const { productId } = req.body;
  if(!(productId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

//Save Favourite Product
save.saveProduct = async(req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req._userId;
    const ProdSaveObj = new ProductSave(req._siteId);
    const row = await ProdSaveObj.duplicateCheck(productId, userId);
    if(row.total > 0) return next(new ApiError(404, 'E0010002', {}, 'Invalid request! Please check your inputs'));
    const result = await ProdSaveObj.save(productId, userId);

    
    req._response = result;
    console.log('RESPONSE',req._response)
    next();
  } catch(err) {
    console.log(err);
    req._response = {};
    next();
  }
}

save.deleteProduct = async(req, res, next) => {
    try {
      const { productId } = req.body;
      const userId = req._userId;
      const ProdSaveObj = new ProductSave(req._siteId);
      const result = await ProdSaveObj.delete(productId, userId);
      req._response = JSON.stringify(result);
      
      console.log('RESPONSE',req._response)
      next();
    } catch(err) {
      console.log(err);
      req._response = {err};
      next();
    }
  }

  save.list = async(req,res,next) => {
    try{

        const userId = req._userId;
        const ProdSaveObj = new ProductSave(req._siteId);
        const result = await ProdSaveObj.list(userId);
        console.log('RESULT FAVOURITE',result)
        req._response =JSON.stringify(result);

        res.status(200).send(req._response);
        next();
        
    }catch(err){
      console.log(err);
      req._response = {err};
      next();
    }
  }

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
save.sendResponse = async(req, res, next) => {
  
  res.status(200).send({result: req._response});
  next();
}

module.exports = save;