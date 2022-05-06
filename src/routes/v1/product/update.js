const ApiError = require("../ApiError");
const { Product, ProductImages, ProductVariants, ProductVideos } = require("../../../core/sql/controller/child");

const update = {};

/**
* validating product request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
update.validateUpdateProductRequest = async(req, res, next) => {
  const { productId, title, category, rating, slug } = req.body;
  if(!productId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* validating variant request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
update.validateUpdateProductVariantRequest = async(req, res, next) => {
  const { variantId } = req.body;
  if(!variantId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* update product details
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
update.updateProduct = async(req, res, next) => {
  try {
    let { productId, title, category, rating, slug } = req.body;
    let params = { title, category, rating, slug };
    const ProductObj = new Product(req._siteId);
    const productUpdate = await ProductObj.updateProduct(productId, params);
    req._response = productUpdate;
    next();
  } catch(err) {
    console.error(err);
    return next(new ApiError(500, 'E0010001', {}, 'There was some problem'));
  }
}

/**
* update product variant
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
update.updateProductVariant = async(req, res, next) => {
  try {
    let { variantId, sku, size, color, qty_in_stock, price, discounted_price } = req.body;
    let params = { sku, size, color, qty_in_stock, price, discounted_price };
    const ProductObj = new ProductVariants(req._siteId);
    const productUpdate = await ProductObj.updateProductVariant(variantId, params);
    req._response = productUpdate;
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
update.sendResponse = async(req, res, next) => {
  res.status(200).send({result: req._response});
  next();
}

module.exports = update;