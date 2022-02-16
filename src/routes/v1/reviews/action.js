const { base } = require("./../../../wrapper")
const {generateSignedUrl: generateReviewSignedUrl} = require("./../../../services/storage");
const { Review, Product } = require("../../../core/sql/controller/child");
const async = require("async");
const action = {};


/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
action.generateSignedUrl = async (req, res, next) => {
  const userId = req._userId;
  const {filename} = req.query;
  generateReviewSignedUrl(req._siteId, 'review', userId, filename).then((resp)=>{
    res.status(200).send(base.success({result: resp}));
    next();
  })
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
action.checkAndGetReviewId = async (req, res, next) => {
  let { productId } = req.query;
  if(!productId) return next(new ApiError(400, 'E0010002'));

  const ReviewObj = new Review(req._siteId);
  const ProductObj = new Product(req._siteId);

  let pid = 0, reviewId = 0;

  async.series({

    GET_PRODUCT_ID: cb => {
      ProductObj.getProductIdFromShopify(productId, (error, result)=>{
        if(result && result.id){
          pid = result.id;
          cb();
        }
        else cb();
      })
    },
    
    GET_REVIEW_ID: cb => {
      if(pid){
        ReviewObj.getReviewIdFromPid(req._userId, pid, (error, result)=>{
          if(result && result.id){
            reviewId = result.id;
            cb();
          }
          else cb();
        })
      }
      else cb();
    },

    CREATE_REVIEW: cb => {
      if(!reviewId){
        ReviewObj.addNewReview(req._userId, pid).then(result=>{
          reviewId = result && result[0] ? result[0] : 0;
          cb();
        })
      }
      else cb();
    }
  }, () => {
    res.status(200).send(base.success({result: {pid, reviewId}}));
        next();
  })
}


module.exports = action;