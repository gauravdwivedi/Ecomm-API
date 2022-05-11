const { Product, Category, ProductImages, ProductVariants, ProductVideos, ProductThumb } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const async = require("async");
const ApiError = require("../ApiError");

const detail = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
detail.validateQuery = (req, res, next) => {
  console.log('REQ Detail',res.pramas)
  let { slug } = req.query;
  if(!slug) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* Fetching from MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
detail.fetchSQL = async (req, res, next) => {
  let { slug } = req.query;
  const userId = req._userId;
  const ProductObj = new Product(req._siteId);
  const ProdImageObj = new ProductImages(req._siteId);
  const ProdVariantObj = new ProductVariants(req._siteId);
  const ProdVideoObj = new ProductVideos(req._siteId);
  const CatObj = new Category(req._siteId);
  const ProdThumbObj = new ProductThumb(req._siteId);
  const product = await ProductObj.productDetailBySlug(slug);
  if(product){
    const category = await CatObj.fetchDetail(product.category);
    const attributes =  await ProdVariantObj.getProductVariants(product.id);
    const images = await ProdImageObj.getProductImages(product.id);
    const videos = await ProdVideoObj.getProductVideos(product.id);
    const likesCount = await ProdThumbObj.count(product.id);
    const likes = await ProdThumbObj.getLikesUserIds(product.id);
    const liked = userId && likes.some( like => like.userId === userId ) ? true : false
    res.status(200).send(base.success({result: { ...product, attributes, images, category, videos, likes: likesCount, liked }}));
    next();
  }
  else{
    res.status(200).send(base.success({result: {}}));
    next();
  }
}

module.exports = detail;
