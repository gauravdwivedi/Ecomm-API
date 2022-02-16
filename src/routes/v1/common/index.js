const express = require('express');
const router = express.Router();
const config = require('./config');
const signedUrl = require("./signedUrl");
const auths = require("../auths");
const error = require('../error');

router.get(`/config`,
config.initialize,
config.addGender,
config.sendResponse,
)

router.get(`/signedUrl`,
auths.setCredentials,
auths.verify,
signedUrl.validateRequest,
signedUrl.generateSignedUrl,
error
)

module.exports = router;