const express = require("express");
const router = express.Router();
const config = require("./config");
const error = require('../error');
const authSID = require("../authSID");

router.get(
  `/getConfig`,
  authSID,
  config.getFromSQL,
  error
);

module.exports = router;
