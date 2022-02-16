const express = require("express");

const router = express.Router();

const error = require('../error');
const auth = require("../auths");

const list = require("./list");

router.get(`/list`,
auth.setCredentials,
auth.verify,
list.validate,
list.fetch,
list.sendResponse,
error);

module.exports = router;