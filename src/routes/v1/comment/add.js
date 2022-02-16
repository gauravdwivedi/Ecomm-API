const { Comment } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const add = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  const { comment, videoId } = req.body;
  const userId = req._userId;
  if(!userId || !comment || !videoId) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInSQL = async (req, res, next) => {
  const userId = req._userId;
  new Comment(req._siteId).save(userId, req.body).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = add;