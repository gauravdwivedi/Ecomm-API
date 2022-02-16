const { Video } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const dislike = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
dislike.validateBody = (req, res, next) => {
  let { videoId } = req.query;
  if(!videoId) return next(new ApiError(400, 'E0010002'));
  
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
dislike.saveSQL = async (req, res, next) => {
  let { videoId } = req.query;
  new Video(req._siteId).like(videoId, (resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = dislike;