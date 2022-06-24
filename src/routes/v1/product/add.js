const ApiError = require("../ApiError");
const { Product, ProductImages, ProductVariants, ProductVideos } = require("../../../core/sql/controller/child");

const add = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.validateRequest = async(req, res, next) => {
  const { title, category, slug, images, attributes } = req.body;
  if(!(title && category && slug && images && attributes )) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

//multiple upload
add.validateAddImages = async(req, res, next) => {
  const { productId, images } = req.body;
  if(!(productId && images)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

//multiple upload
add.validateAddVariants = async(req, res, next) => {
  const { productId, attributes } = req.body;
  if(!(productId && attributes)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

//single upload
add.validateAddVideo = async(req, res, next) => {
  const { productId, video } = req.body;
  if(!(productId && video)) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.addProduct = async(req, res, next) => {
  try {
    let { title, description, category, rating, slug, images, attributes } = req.body;
    const ProductObj = new Product(req._siteId);
    const ProdVariantObj = new ProductVariants(req._siteId);
    const ProdImageObj = new ProductImages(req._siteId);
    let productId = await ProductObj.saveProduct(title, description, category, rating, slug);
    if(productId === "error"){
      next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
    }else{
      await ProdVariantObj.saveProductVariants(productId, attributes);
      await ProdImageObj.saveProductImages(productId, images);
      req._response = productId; 
    }
    next();
  } catch(err) {
    console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
  }
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.addProductImages = async(req, res, next) => {
  try {
    let { productId, images } = req.body;
    const ProdImageObj = new ProductImages(req._siteId);
    await ProdImageObj.saveProductImages(productId, images);
    req._response = productId;
    next();
  } catch(err) {
    console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
  }
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.addProductVariants = async(req, res, next) => {
  try {
    let { productId, attributes } = req.body;
    const ProdVariantObj = new ProductVariants(req._siteId);
    await ProdVariantObj.saveProductVariants(productId, attributes);
    req._response = productId;
    next();
  } catch(err) {
    console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
  }
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.addProductVideo = async(req, res, next) => {
  try {
    let { productId, video } = req.body;
    const ProdVideoObj = new ProductVideos(req._siteId);
    await ProdVideoObj.saveProductVideo(productId, video);
    req._response = productId;
    next();
  } catch(err) {
    console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
  }
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = add;