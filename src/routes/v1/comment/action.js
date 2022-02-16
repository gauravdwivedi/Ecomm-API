const { Comment } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const action = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
action.validate = (req, res, next) => {
  const { commentId } = req.query;
  const userId = req._userId;
  if(!userId || !commentId) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
action.like = async (req, res, next) => {
  const { commentId } = req.query;
  const userId = req._userId;
  new Comment(req._siteId).like(commentId, userId).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
action.dislike = async (req, res, next) => {
  const { commentId } = req.query;
  const userId = req._userId;
  new Comment(req._siteId).dislike(commentId, userId).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = action;