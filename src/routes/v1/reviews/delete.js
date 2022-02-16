const { Review } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const deleteAction = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.validateBody = (req, res, next) => {
  let { id } = req.query;
  if(!id) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.saveInSQL = async (req, res, next) => {
  let { id } = req.query;
  new Review(req._siteId).delete(id).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = deleteAction;