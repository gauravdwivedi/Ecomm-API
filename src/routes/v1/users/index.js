const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const list = require('./list');
const detail = require("./detail");
const update = require("./update");
const deleteUser = require("./delete");
const updateUserRole = require("./updateUserRole");
const updateUserDetails = require("../userAuth/updateUserDetails")

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
  '/updateUserDetails',
  auths.setCredentials,
  updateUserDetails.validateRequest,
  updateUserDetails.save,
  updateUserDetails.sendResponse,
  error
)

router.post(
  '/add-user',
  auths.setCredentials
  )

router.patch(
  "/updateUserRole",
  auths.setCredentials,
  auths.verify,
  updateUserRole.validateRequest,
  updateUserRole.save,
  updateUserRole.sendResponse,
  error
);

router.delete(
  '/deleteUser',
  auths.setCredentials,
  deleteUser.validateRequest,
  deleteUser.deleteUser,
  deleteUser.sendResponse,
  error
)

module.exports = router;
