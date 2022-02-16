const { Comment } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const deleteAction = {};

/**
* Validating api query parameters
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.validate = (req, res, next) => {
  let { id } = req.query;
  if(!id) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* deleting from MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.deleteSQL = async (req, res, next) => {
  let { id } = req.query;
  new Comment(req._siteId).delete(id).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = deleteAction;