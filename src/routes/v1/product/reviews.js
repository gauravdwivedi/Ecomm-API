const { Product, Review, Video } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const async = require("async");
const reviews = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
reviews.validateQuery = (req, res, next) => {
  let { slug, page, limit } = req.query;
  if(!slug) return next(new ApiError(400, 'E0010002'));

  if(!limit) limit = 2;
  page = page ? Number(page) : 1;
  req.query.page = page;
  req.query.offset =(page-1)*Number(limit);
  req.query.limit = Number(limit);

  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
reviews.fetchSQL = async (req, res, next) => {
  let { slug, offset, limit } = req.query;
  const ReviewObj = new Review(req._siteId);
  const ProductObj = new Product(req._siteId);
  const VideoObj = new Video(req._siteId);

  let productDetail = {}, productId = 0,totalReviews = 0, videos = [], products = {};

  async.series({

    GET_PRODUCT_ID: cb => {
      ProductObj.detail(slug, (error, result)=>{
        productDetail = result && result[0] ? result[0] : {};
        productId = productDetail && productDetail.id ? productDetail.id : 0;
        cb();
      })
    },

    GET_VIDEO_COUNT: cb => {
      if(productId){
        ReviewObj.getProductReviewCount(productId, (error, total)=>{
          totalReviews = total;
          cb();
        })
      }
      else cb();
    },
    
    GET_VIDEO_LIST: cb => {
      if(productId && totalReviews){
        ReviewObj.getProductReviewList(productId, offset, limit, (error, result)=>{
          videos = result;
          cb();
        })
      }
      else cb();
      
    }

  }, () => {
    res.status(200).send(base.success({result: _wrapper(req.query, totalReviews, videos, productDetail)}));
        next();
  })
}



const _wrapper = (params, total, list, productDetail) =>{
  if(list && list.length){
    let videosList = [];
    list.map(video=>{
      let tuple = {
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
        product: [productDetail],
        review:{
          text: video.text,
          attachments: video.attachments,
          star: video.star,
          id: video.reviewId,
          createTime: video.createTime
        }
      }
      videosList.push(tuple);
    })  
    list = videosList;
  }
  const resp = {
    meta:{
      total: total || 0,
      pages: total ? Math.ceil(total/params.limit) : 0,
      currentPage: params.page
    },
    list
  }

  return resp;
}


module.exports = reviews;
