const express = require('express');
const router = express.Router();
const videos = require("./list");
const like = require("./like");
const dislike = require("./dislike");
const error = require('../error');
const auth = require("./../auth");
const auths = require("../auths");

router.get(`/list`,
auths.setCredentials,
videos.validateBody,
videos.fetchSQL,
error
) 

router.get(`/like`,
auths.setCredentials,
like.validateBody,
like.saveSQL,
error
) 

router.get(`/dislike`,
auths.setCredentials,
dislike.validateBody,
dislike.saveSQL,
error
) 

router.get(`/getNavList`,
auths.setCredentials,
videos.getNavList,
videos.sendNavigationResponse,
error
) 

module.exports = router;