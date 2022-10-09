const express = require("express");
const router = express.Router();
const error = require("../error");
const auths =require("../auths");
const addBanner=require("./add");


router.post('/add',
auths.setCredentials,
auths.verify,
addBanner.validateRequest,
addBanner.add,
addBanner.sendResponse,
error
)


module.exports = router;