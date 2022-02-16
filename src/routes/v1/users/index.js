const verify = require("./verify");
const register = require("./register");
const changePassword = require("./changePassword");
const updateUserDetails = require("./updateUserDetails");
const detail = require("./detail");
const resetPasswordTrigger = require("./resetPasswordTrigger");
const resetPasswordVerify = require("./resetPasswordVerify");

const express = require('express');
const router = express.Router();
const error = require('../error');
const auths = require("../auths");

router.post('/user/verify',
auths.setCredentials,
verify.validate,
verify.checkExistence,
verify.generateToken,
verify.sendResponse,
error)

router.post('/user/register',
auths.setCredentials,
register.authenticateSignUpToken,
register.validateRequest,
register.ifSignUp,
register.generateToken,
register.sendResponse,
error)

router.post('/user/changePassword',
auths.setCredentials,
auths.verify,
changePassword.validateRequest,
changePassword.matchPassword,
changePassword.saveNewPassword,
changePassword.sendResponse,
error)

router.patch('/user',
auths.setCredentials,
auths.verify,
updateUserDetails.validateRequest,
updateUserDetails.save,
updateUserDetails.sendResponse,
error);

router.get('/myprofile',
auths.setCredentials,
auths.verify,
detail.getDetail,
detail.sendResponse,
error);

router.patch('/resetPassword/trigger',
auths.setCredentials,
resetPasswordTrigger.validateRequest,
resetPasswordTrigger.generateToken,
resetPasswordTrigger.saveToken,
resetPasswordTrigger.sendEmail,
resetPasswordTrigger.sendResponse,
error);

router.patch('/resetPassword/verify',
auths.setCredentials,
resetPasswordVerify.validateRequest,
resetPasswordVerify.validateToken,
resetPasswordVerify.savePassword,
resetPasswordVerify.sendResponse,
error);

module.exports = router;