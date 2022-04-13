const { Product } = require("../../../core/sql/controller/child");
const { base } = require("../../../wrapper");
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
    res.status(200).send(base.success({result: response}));
    next();
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
  

  // ProductObj.productDetail(slug, (error, response)=>{
  //   res.status(200).send(base.success({result: _wrapper(response)}));
  //   next();
  // })
    let data = {
      id: 1,
      category: 12,
      Images: ["/images/detail-video/gallery-img.svg", "/images/detail-video/gallery-img.svg", "/images/detail-video/gallery-img.svg", "/images/detail-video/gallery-img.svg"],
      video_url: "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/rj3VhjeXiok7px9t/videoblocks-a-young-woman-holds-a-warm-sweater-on-her-hanger-on-which-a-tag-with-a-price-weighs-a-lady-looks-at-the-material-from-which-this-clothing-is-made_bvufjsg3z__d5af3b8987ca67810c952028dea4381a__P360.mp4",
      title: 'Perry Blue Dress',
      description: 'Lorem ipsum dolor sit amet, consectetur piscing elit, sed do tempor incididunt on.',
      attributes: '',
      qty_in_stock: 100,
      price: 25,
      discounted_price: 20,
      rating: 4
    };
    res.status(200).send(base.success({ result: data }));
}


const _wrapper = (videos) =>{
  let detail = {};
  let videosList = [];
  videos.forEach(video => {
    videosList.push({
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
        slug: video.video_slug,
        title: video.video_title || null,
        keywords: video.video_keywords || null,
        og_title: video.video_og_title || null,
        og_image: video.video_og_image || null,
        og_description: video.video_og_description || null
      }
    })
  })
  
  if(videos[0] && videos[0].productId){
    detail = {
      videos: videosList,
      product: {
        id: videos[0].productId,
        name: videos[0].productName,
        description: videos[0].description,
        size: videos[0].size,
        price: videos[0].price,
        images: videos[0].images,
        mobile_images: videos[0].mobile_images,
        shopify_product_id: videos[0].shopify_product_id,
        detail: videos[0].detail,
        more: false
      },
      meta: {
        slug: videos[0].slug,
        title: videos[0].title,
        keywords: videos[0].keywords,
        og_title: videos[0].og_title,
        og_image: videos[0].og_image,
        og_description: videos[0].og_description
      }
    }
  }
 
  return detail;
}


module.exports = detail;
