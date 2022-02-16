const express = require('express');
const router = express.Router();
const comments = require("./list");
const add = require("./add");
const action = require("./action");
const deleteComment = require("./delete");
const error = require('../error');
const auths = require("../auths");

router.get(`/list`,
auths.setCredentials,
auths.setProfile,
comments.validateBody,
comments.fetchSQL,
error
) 

router.post(`/post`,
auths.setCredentials,
auths.verify,
add.validateBody,
add.saveInSQL,
error
) 


router.delete(`/delete`,
auths.setCredentials,
auths.verify,
deleteComment.validate,
deleteComment.deleteSQL,
error
) 

router.get(`/like`,
auths.setCredentials,
auths.verify,
action.validate,
action.like,
error
) 


router.get(`/dislike`,
auths.setCredentials,
auths.verify,
action.validate,
action.dislike,
error
) 




module.exports = router;