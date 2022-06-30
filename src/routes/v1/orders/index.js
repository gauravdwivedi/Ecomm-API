const express = require("express");
const router = express.Router();
const error = require("../error");
const auths = require("../auths");

const newOrder = require('./new');
const cancelOrder = require('./cancel');
const paymentOrder = require('./payment');
const list = require('./list');
const details = require('./details');
const allOrders = require('./allOrders');
const userOrders = require('./userOrders');

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

router.get(
  '/list',
  auths.setCredentials,
  auths.verify,
  list.validateRequest,
  list.orders,
  list.sendResponse,
  error
)

router.get(
  '/allOrders',
  auths.setCredentials,
  auths.verify,
  allOrders.validateRequest,
  allOrders.orders,
  allOrders.sendResponse,
  error
)

router.get(
  '/user/:userId',
  auths.setCredentials,
  auths.verify,
  userOrders.validateRequest,
  userOrders.order,
  userOrders.sendResponse,
  error
)

router.get(
  '/:id',
  auths.setCredentials,
  auths.verify,
  details.validateRequest,
  details.order,
  details.sendResponse,
  error
)
module.exports = router;
