const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const list = require('./list');
const detail = require("./detail");
const changePassword = require("./changePassword");
const update = require("./update");
const deleteUser = require("./delete");

router.get(
  '/list',
  auths.setCredentials,
  list.validateRequest,
  list.getUsersList,
  list.sendResponse,
  error
)

router.post(
  '/detail',
  auths.setCredentials,
  detail.validateRequest,
  detail.getUserDetail,
  detail.sendResponse,
  error
)

router.patch(
  '/changePassword',
  auths.setCredentials,
  changePassword.validateRequest,
  changePassword.changePassword,
  changePassword.sendResponse,
  error
)

router.patch(
  '/updateUserDetails',
  auths.setCredentials,
  update.validateRequest,
  update.updateUserDetails,
  update.sendResponse,
  error
)

router.delete(
  '/deleteUser',
  auths.setCredentials,
  deleteUser.validateRequest,
  deleteUser.deleteUser,
  deleteUser.sendResponse,
  error
)

module.exports = router;
