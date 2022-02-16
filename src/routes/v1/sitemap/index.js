const express = require('express');
const router = express.Router();
const fetch = require("./fetch");
const error = require('../error');
const auths = require("../auths");

router.get(`/`,
auths.setCredentials,
fetch.fetch,
error
)

module.exports = router;