const express = require("express");
const router = express.Router();
const detail = require("./detail");
const detail_ = require("./detail_");
const list = require("./list");
const add = require("./add");
const likeUnlike = require('./likeUnlike');
const reviews = require("./reviews");
const error = require("../error");
const auths = require("../auths");
const update = require("./update");
const deleteAction = require("./delete");
const save = require('./save');

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
  `/addProductImages`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  add.validateAddImages,
  add.addProductImages,
  add.sendResponse,
  error
);

router.post(
  `/addProductVariants`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  add.validateAddVariants,
  add.addProductVariants,
  add.sendResponse,
  error
);

router.post(
  `/addProductVideo`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  add.validateAddVideo,
  add.addProductVideo,
  add.sendResponse,
  error
);

router.post(
  `/like`,
  auths.setCredentials,
  auths.verify,
  likeUnlike.validateRequest,
  likeUnlike.likeProduct,
  likeUnlike.sendResponse,
  error
);

router.post(
  `/unlike`,
  auths.setCredentials,
  auths.verify,
  likeUnlike.validateRequest,
  likeUnlike.unlikeProduct,
  likeUnlike.sendResponse,
  error
);

router.post(
  `/save`,
  auths.setCredentials,
  auths.verify,
  save.validateRequest,
  save.saveProduct,
  save.sendResponse,
  error
  )

  router.post(
    `/delete`,
    auths.setCredentials,
    auths.verify,
    save.validateRequest,
    save.deleteProduct,
    save.sendResponse,
    error
    )

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
  `/deleteProduct`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  deleteAction.validateBody,
  deleteAction.deleteProduct,
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

router.delete(
  `/deleteProductVideo`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  deleteAction.validateBody,
  deleteAction.deleteProductVideo,
  error
);

router.get(
  `/list`,
  auths.setCredentials,
  auths.setProfile,
  list.validateBody,
  list.productList,
  error
);

router.get(
  `/detail`,
  auths.setCredentials,
  auths.setProfile,
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
