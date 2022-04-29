const express = require("express");
const router = express.Router();
const detail = require("./detail");
const detail_ = require("./detail_");
const list = require("./list");
const add = require("./add");
const reviews = require("./reviews");
const error = require("../error");
const auths = require("../auths");
const update = require("./update");
const deleteAction = require("./delete");

router.post(
  `/add`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  add.validateRequest,
  add.addProduct,
  add.sendResponse,
  error
);

router.post(
  `/updateProduct`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  update.validateUpdateProductRequest,
  update.updateProduct,
  update.sendResponse,
  error
);

router.post(
  `/updateVariant`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  update.validateUpdateProductVariantRequest,
  update.updateProductVariant,
  update.sendResponse,
  error
);

router.delete(
  `/deleteVariant`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  deleteAction.validateBody,
  deleteAction.deleteProductImage,
  error
);

router.delete(
  `/deleteProductImage`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  deleteAction.validateBody,
  deleteAction.deleteProductImage,
  error
);

router.get(
  `/list`,
  auths.setCredentials,
  list.validateBody,
  list.productList,
  error
);

router.get(
  `/detail`,
  auths.setCredentials,
  detail.validateQuery,
  detail.fetchSQL,
  error
);

router.get(
  `/detailwithVideo`,
  auths.setCredentials,
  detail_.validateQuery,
  detail_.fetchDetailVideo,
  error
);

router.get(
  `/reviews`,
  auths.setCredentials,
  reviews.validateQuery,
  reviews.fetchSQL,
  error
);

module.exports = router;
