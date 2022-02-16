const express = require('express');
const router = express.Router();
const reviews = require("./list");
const action = require("./action");
const add = require("./add");
const deleteReview = require("./delete");
const error = require('../error');
const auth = require("./../auth");
const auths = require("../auths");

router.get(`/pendingList`,
auths.setCredentials,
auths.verify,
reviews.validateBody,
reviews.pendingList,
error
) 

router.get(`/reviewedList`,
auths.setCredentials,
auths.verify,
reviews.validateBody,
reviews.reviewedList,
error
) 

router.get(`/generateSignedUrl`,
auths.setCredentials,
auths.verify,
action.generateSignedUrl,
error
) 

router.get(`/checkAndGetReviewId`,
auths.setCredentials,
auths.verify,
action.checkAndGetReviewId,
error
) 

router.post(`/postReview`,
auths.setCredentials,
auths.verify,
add.validateBody,
add.saveInSQL,
error
) 

router.get(`/delete`,
auths.setCredentials,
auths.verify,
deleteReview.validateBody,
deleteReview.saveInSQL,
error
) 



module.exports = router;