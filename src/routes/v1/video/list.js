const { Video, Menu, Review } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const async = require("async");
const list = {};
const stringHelper = require('../../../core/helper/stringHelper');

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
list.validateBody = (req, res, next) => {
  let { page, limit } = req.query;
  if(!limit) limit = 10;
  
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
list.fetchSQL = async (req, res, next) => {
  let { offset, limit, categorySlug, videoSlug } = req.query;
  const VideoObj = new Video(req._siteId);
  let menu = {}, menuId = 0, totalVideos = 0, videos = [], products = {};
  
  async.series({
    
    MENU_ID_FROM_SLUG: cb => {
      if(categorySlug){
        const MenuObj = new Menu(req._siteId);
        MenuObj.getMenuId(categorySlug, (error, result)=>{
          menu = result;
          menuId = result && result.id ? result.id : 0;
          cb();
        })
      }
      else cb();
    },
    
    GET_VIDEO_COUNT: cb => {
      VideoObj.count(menuId, (error, total)=>{
        totalVideos = total;
        cb();
      })
    },

    GET_FIRST_VIDEO: cb => {
      if(totalVideos && videoSlug && !offset){
        VideoObj.getFirstVideo(videoSlug, menuId, (error, result)=>{
          videos = result || [];
          cb();
        })
      }
      else cb();
    },
    
    GET_VIDEO_LIST: cb => {
      if(totalVideos){
        VideoObj.list(menuId, offset, limit, videoSlug, (error, result)=>{
          videos = [...videos, ...result];
          cb();
        })
      }
      else cb();
    },
    
    GET_VIDEO_PRODUCT: cb => {
      if(totalVideos){
        const allVideoIDs = videos.filter(video=>video.videoId).map(video=>video.videoId);
        VideoObj.getProducts(allVideoIDs, (error, result)=>{
          req._productIds = [];
          if(result && result.length){
            result.forEach(product=>{
              req._productIds.push(product.id);
              if(products[product.video_id]) products[product.video_id].push(product);
              else products[product.video_id] = [product]
            })
            req._productIds = [...new Set(req._productIds)].filter(e => e);
            cb();
          }
          else cb();
        })
      }
      else cb();
    },
    ADD_REVIEW_COUNTS: cb => {
      if(Array.isArray(req._productIds) && req._productIds.length){
        let scripts = [];
        req._reviewCount = {};
        req._productIds.forEach(_id => {
          scripts.push(_cb => new Review(req._siteId).getProductReviewCount(_id, (error, result) => {
            req._reviewCount[_id] = result;
            _cb();
          }))
        })
        async.parallelLimit(scripts, 10, () => cb())
      }else{
        cb();
      }
    }
  }, () => {
    res.status(200).send(base.success({result: _wrapper(req.query, totalVideos, videos, menu, products, req._reviewCount)}));
    next();
  })
}

/**
* Mini menu list for navigation panel
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/

list.getNavList = async (req, res, next) => {
  let { menuId } = req.query;
  if(menuId){
    const MenuObj = new Menu(req._siteId);
    const VideoObj = new Video(req._siteId);
    
    let videoMap = new Map();
    let submenuList = [];
    
    MenuObj.getSubCategories(menuId, (error, result)=>{
      if(result && result.length){
        submenuList = result;
        let scripts = [];
        result.map((menu)=> {
          scripts.push(cb=>{
            VideoObj.shortList(menu.id, (error, result)=>{
              videoMap.set(menu.id, result);
              cb();
            })
          })
        })
        
        async.parallelLimit(scripts, 5, (results)=>{
          req._videos = videoMap;
          next();
        });
      }
      else next ();
    })
  }
  else next();
}

list.sendNavigationResponse = (req, res, next) =>{
  res.status(200).send(base.success({result: req._videos ? Object.fromEntries(req._videos) : {}}));
  next();
}


const _wrapper = (params, total, list, menu, products, reviewCount) =>{
  if(list && list.length){
    let videosList = [];
    list.map(video=>{
      (products[video.videoId] || []).forEach(_product => {
        _product.totalReviewCount = stringHelper.formatCount(reviewCount[_product.id] || 0);
      })

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
        captionUrl: video.caption_url,
        meta: {
          slug: video.slug,
          title: video.title,
          keywords: video.keywords,
          og_title: video.og_title,
          og_image: video.og_image,
          og_description: video.og_description
        },
        product: products[video.videoId] ?  products[video.videoId] : []
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
    list,
    menu
  }
  return resp;
}


module.exports = list;
