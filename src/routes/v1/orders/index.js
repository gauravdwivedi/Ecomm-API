const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const newOrder = require('./new');
const cancelOrder = require('./cancel');
const paymentOrder = require('./payment');

router.post(
  '/new',
  auths.setCredentials,
  auths.verify,
  newOrder.validateRequest,
  newOrder.new,
  newOrder.sendResponse,
  error
)

router.post(
  '/cancel',
  auths.setCredentials,
  auths.verify,
  cancelOrder.validateRequest,
  cancelOrder.cancel,
  cancelOrder.sendResponse,
  error
)

router.post(
  '/payment',
  auths.setCredentials,
  auths.verify,
  paymentOrder.validateRequest,
  paymentOrder.payment,
  paymentOrder.sendResponse,
  error
)
module.exports = router;
