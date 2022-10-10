const express = require("express");
const router = express.Router();
const error = require("../error");
const auths =require("../auths");
const addBanner=require("./add");
const bannerList = require("./list");
const deleteBanner =require("./delete");


router.post('/add',
auths.setCredentials,
auths.verify,
addBanner.validateRequest,
addBanner.add,
addBanner.sendResponse,
error
)

router.get('/list',
auths.setCredentials,
auths.verify,
bannerList.list,
bannerList.sendResponse,
error
)

router.delete('/delete',
auths.setCredentials,
auths.verify,
deleteBanner.delete,
deleteBanner.sendResponse,
error)


module.exports = router;