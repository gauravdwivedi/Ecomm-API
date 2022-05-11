const ApiError = require("../ApiError");
const { ProductThumb } = require("../../../core/sql/controller/child");

const likeUnlike = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
likeUnlike.validateRequest = async(req, res, next) => {
  const { productId } = req.body;
  if(!(productId)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

//like video
likeUnlike.likeProduct = async(req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req._userId;
    const ProdThumbObj = new ProductThumb(req._siteId);
    const result = await ProdThumbObj.like(productId, userId);
    req._response = result;
    next();
  } catch(err) {
    console.log(err);
    req._response = {};
    next();
  }
}

//dislike video
likeUnlike.unlikeProduct = async(req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req._userId;
    const ProdThumbObj = new ProductThumb(req._siteId);
    const result = await ProdThumbObj.unlike(productId, userId);
    req._response = result;
    next();
  } catch(err) {
    console.log(err);
    req._response = {};
    next();
  }
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
likeUnlike.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = likeUnlike;