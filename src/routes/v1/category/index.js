const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const list = require('./list');
const detail = require('./detail');
const addCategory = require("./add");
const update = require("./update");
const deleteCategory = require("./delete");
const upload = require("./upload")

router.get(
  '/list',
  auths.setCredentials,
  list.validateRequest,
  list.getCategoryList,
  list.sendResponse,
  error
)

router.post(
  `/uploadicon`,
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  auths.setCredentials,
  upload.icon,
  upload.sendResponse,
  error
)

router.post(
  '/detail',
  auths.setCredentials,
  detail.validateRequest,
  detail.getCategoryDetail,
  detail.sendResponse,
  error
)

router.post(
  '/add',
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  addCategory.validateRequest,
  addCategory.add,
  addCategory.sendResponse,
  error
)

router.patch(
  '/update',
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  update.validateRequest,
  update.updateCategoryDetails,
  update.sendResponse,
  error
)

router.delete(
  '/delete',
  auths.setCredentials,
  auths.verify,
  auths.verifyAdmin,
  deleteCategory.validateRequest,
  deleteCategory.deleteCategory,
  deleteCategory.sendResponse,
  error
)

module.exports = router;
