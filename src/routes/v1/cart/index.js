const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const add = require('./add');
const deleteAction = require('./delete');
const list = require('./list');

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

router.get(
  '/list',
  auths.setCredentials,
  auths.verify,
  list.validateRequest,
  list.listCart,
  list.sendResponse,
  error
)

module.exports = router;
