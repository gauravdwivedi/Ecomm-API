const express = require('express');
const router = express.Router();
const detail = require("./detail");
const detail_ = require("./detail_");
const reviews = require("./reviews");
const error = require('../error');
const auths = require("../auths");

router.get(`/detail`,
auths.setCredentials,
detail.validateQuery,
detail.fetchSQL,
error
) 

router.get(`/detailwithVideo`,
auths.setCredentials,
detail_.validateQuery,
detail_.fetchDetailVideo,
error
) 

router.get(`/reviews`,
auths.setCredentials,
reviews.validateQuery,
reviews.fetchSQL,
error
) 




module.exports = router;