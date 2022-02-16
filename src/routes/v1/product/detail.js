const { Product } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const async = require("async");
const detail = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
detail.validateQuery = (req, res, next) => {
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
  const ProductObj = new Product(req._siteId);

  ProductObj.detail(slug, (error, response)=>{
    console.log('AMAMAMAMAMAM', response);
    if(response && response[0] && response[0].id){
      ProductObj.productVideo(response[0].id, (error, video)=>{
        res.status(200).send(base.success({result: {...response[0], ...video}}));
        next();
      })
    }
    else{
      res.status(200).send(base.success({result: {}}));
      next();
    }
  })
}


/**
* Fetching from MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
detail.fetchDetailVideo = async (req, res, next) => {
  let { slug } = req.query;
  const ProductObj = new Product(req._siteId);

  ProductObj.videoDetail(slug, (error, response)=>{
    res.status(200).send(base.success({result: _wrapper(response)}));
    next();
  })
}


const _wrapper = (video) =>{
  let detail = {};
  if(video && video.productId){
    detail = {
      id: video.videoId,
      name: video.name,
      srt: video.caption_url,
      captionUrl: video.caption_url,
      thumbnail: video.thumbnail,
      description: video.description,
      duration: video.duration,
      desktop_src: video.desktop_src,
      mobile_src: video.mobile_src,
      like: video.like,
      hls_public_url: video.hlsUrl,
      poster: video.poster,
      categoryId: video.catagoryId,
      subCategoryId: video.subCategoryId,
      meta: {
        slug: video.slug,
        title: video.title,
        keywords: video.keywords,
        og_title: video.og_title,
        og_image: video.og_image,
        og_description: video.og_description
      },
      product: [{
        id: video.productId,
        name: video.productName,
        description: video.description,
        size: video.size,
        price: video.price,
        images: video.images,
        mobile_images: video.mobile_images,
        shopify_product_id: video.shopify_product_id,
        detail: video.detail,
        more: false
      }]
    }
  }
  const resp = {
    detail
  }
  return resp;
}


module.exports = detail;
