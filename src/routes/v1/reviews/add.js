const { Review } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const add = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.validateBody = (req, res, next) => {
  const { text, star, productId } = req.body;
  if(!text || !star || !productId) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
add.saveInSQL = async (req, res, next) => {
  new Review(req._siteId).save(req._userId, req.body).then((resp)=>{
    res.status(200).send(base.success());
    next();
  })
}


module.exports = add;