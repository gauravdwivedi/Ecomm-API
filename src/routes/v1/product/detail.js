const { Product, Category, ProductImages, ProductVariants, ProductVideos, ProductThumb, Cart ,ProductSave} = require("../../../core/sql/controller/child");
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
  const product = await new Product(req._siteId).productDetailBySlug(slug);
  if(product){
    const category = await new Category(req._siteId).fetchDetail(product.category);
    const attributes =  await new ProductVariants(req._siteId).getProductVariants(product.id);
    const images = await new ProductImages(req._siteId).getProductImages(product.id);
    const videos = await new ProductVideos(req._siteId).getProductVideos(product.id);
    const cartList = await new Cart(req._siteId).listCart(userId);
    const productInCart = userId && cartList.some( cart => cart.productId === product.id ) ? true : false
    const likesCount = await new ProductThumb(req._siteId).count(product.id);
    const likes = await new ProductThumb(req._siteId).getLikesUserIds(product.id);
    const liked = userId && likes.some( like => like.userId === userId ) ? true : false
    const favourite = await new ProductSave(req._siteId).getFavouritesUserIds(product.id);
    const saved = userId && favourite.some( fav => fav.userId === userId) ? true : false
    res.status(200).send(base.success({result: { ...product, attributes, images, category, videos, likes: likesCount, liked,saved, productInCart }}));
    next();
  }
  else{
    res.status(200).send(base.success({result: {}}));
    next();
  }
}

module.exports = detail;
