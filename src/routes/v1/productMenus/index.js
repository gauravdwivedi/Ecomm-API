const fetchMenuLinks = require("./fetchMenuLinks");
const fetchMenus = require("./fetchMenus");

const express = require("express");

const router = express.Router();

const error = require('../error');
const auths = require("../auths");

router.get('/link',
auths.setCredentials,
//auths.verify,
fetchMenuLinks.validate,
fetchMenuLinks.fetch,
fetchMenuLinks.buildResponse,
error)

router.get('/menus',
auths.setCredentials,
//auths.verify,
fetchMenus.validate,
fetchMenus.fetch,
fetchMenus.buildResponse,
error)

module.exports = router;