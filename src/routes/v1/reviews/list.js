const { Review, Video } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const async = require("async");
const reviews = {};


/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
reviews.validateBody = (req, res, next) => {
  let { page, limit } = req.query;
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
reviews.pendingList = async (req, res, next) => {
  let { offset, limit } = req.query;
  const ReviewObj = new Review(req._siteId);
  const VideoObj = new Video(req._siteId);

  let totalReviews = 0, videos = [], products = {};

  async.series({

    GET_VIDEO_COUNT: cb => {
      ReviewObj.getPendingCount(req._userId, (error, total)=>{
        totalReviews = total;
        cb();
      })
    },
    
    GET_VIDEO_LIST: cb => {
      if(totalReviews){
        ReviewObj.getPendingList(req._userId, offset, limit, (error, result)=>{
          videos = result;
          cb();
        })
      }
      else cb();
    },

    GET_VIDEO_PRODUCT: cb => {
      if(totalReviews){
        const allVideoIDs = videos.filter(video=>video.videoId).map(video=>video.videoId);
        VideoObj.getProducts(allVideoIDs, (error, result)=>{
          if(result && result.length){
            result.forEach(product=>{
              if(products[product.video_id]) products[product.video_id].push(product);
              else products[product.video_id] = [product]
            })
            cb();
          }
          else cb();
        })
      }
      else cb();
    }
  }, () => {
    res.status(200).send(base.success({result: _wrapper(req.query, totalReviews, videos, products)}));
        next();
  })
}

reviews.reviewedList = async (req, res, next) => {
  let { offset, limit } = req.query;
  const ReviewObj = new Review(req._siteId);
  const VideoObj = new Video(req._siteId);

  let totalReviews = 0, videos = [], products = {};

  async.series({

    GET_VIDEO_COUNT: cb => {
      ReviewObj.getReviewedCount(req._userId, (error, total)=>{
        totalReviews = total;
        cb();
      })
    },
    
    GET_VIDEO_LIST: cb => {
      if(totalReviews){
        ReviewObj.getReviewedList(req._userId, offset, limit, (error, result)=>{
          videos = result;
          cb();
        })
      }
      else cb();
    },

    GET_VIDEO_PRODUCT: cb => {
      if(totalReviews){
        const allVideoIDs = videos.filter(video=>video.videoId).map(video=>video.videoId);
        VideoObj.getProducts(allVideoIDs, (error, result)=>{
          if(result && result.length){
            result.forEach(product=>{
              if(products[product.video_id]) products[product.video_id].push(product);
              else products[product.video_id] = [product]
            })
            cb();
          }
          else cb();
        })
      }
      else cb();
    }
  }, () => {
    res.status(200).send(base.success({result: _wrapper(req.query, totalReviews, videos, products)}));
        next();
  })
}



const _wrapper = (params, total, list, products) =>{
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
        product: products[video.videoId] ?  products[video.videoId] : [],
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
