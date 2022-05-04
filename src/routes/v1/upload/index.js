const express = require("express");
const router = express.Router();
const auths = require("../auths");
const error = require("../error");
const files = require("./files");

router.post(
  "/files",
  auths.setCredentials,
  auths.verify,
  files.validateRequest,
  files.uploadFiles,
  files.sendResponse,
  error
);

module.exports = router;