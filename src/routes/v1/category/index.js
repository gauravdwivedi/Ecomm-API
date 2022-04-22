const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const list = require('./list');
const addCategory = require("./add");
const update = require("./update");
const deleteCategory = require("./delete");

router.get(
  '/list',
  auths.setCredentials,
  list.validateRequest,
  list.getCategoryList,
  list.sendResponse,
  error
)


router.post(
  '/addCategory',
  auths.setCredentials,
  addCategory.validateRequest,
  addCategory.add,
  addCategory.sendResponse,
  error
)

router.patch(
  '/updateCategoryDetails',
  auths.setCredentials,
  update.validateRequest,
  update.updateCategoryDetails,
  update.sendResponse,
  error
)

router.delete(
  '/deleteCategory',
  auths.setCredentials,
  deleteCategory.validateRequest,
  deleteCategory.deleteCategory,
  deleteCategory.sendResponse,
  error
)

module.exports = router;
