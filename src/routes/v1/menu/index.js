const express = require('express');
const router = express.Router();
const fetch = require("./fetch");
const error = require('../error');
const auths = require("../auths");

router.get(`/fetch`,
auths.setCredentials,
fetch.fetch,
fetch.buildResponse,
error
)

module.exports = router;