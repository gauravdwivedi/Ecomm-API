const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const add = require('./add');
const deleteAction = require('./delete');

router.post(
  '/add',
  auths.setCredentials,
  auths.verify,
  add.validateRequest,
  add.add,
  add.sendResponse,
  error
)

router.delete(
  '/remove',
  auths.setCredentials,
  auths.verify,
  deleteAction.validateRequest,
  deleteAction.removeFromCart,
  deleteAction.sendResponse,
  error
)

module.exports = router;
