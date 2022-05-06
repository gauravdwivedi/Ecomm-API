const { Review, Product } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const deleteAction = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.validateBody = (req, res, next) => {
  let { id } = req.body;
  if(!id) return next(new ApiError(400, 'E0010002'));
  next();
}

/**
* delete product variant
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.deleteProduct = async (req, res, next) => {
  let { id } = req.body;
  const ProdObj = new Product(req._siteId);
  await ProdObj.deleteProduct(id);
  await ProdObj.deleteProductVariantsByProductId(id);
  await ProdObj.deleteProductImagesByProductId(id);
  await ProdObj.deleteProductVideosByProductId(id);
  res.status(200).send(base.success());
  next();
}

/**
* delete product variant
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.deleteProductVariant = async (req, res, next) => {
  let { id } = req.body;
  const ProdObj = new Product(req._siteId);
  await ProdObj.deleteProductVariant(id);
  res.status(200).send(base.success());
  next();
}

/**
* delete product image
* @param {*} req
* @param {*} res
* @param {*} next
*/
deleteAction.deleteProductImage = async (req, res, next) => {
  let { id } = req.body;
  const ProdObj = new Product(req._siteId);
  await ProdObj.deleteProductImage(id);
  res.status(200).send(base.success());
  next();
}


module.exports = deleteAction;