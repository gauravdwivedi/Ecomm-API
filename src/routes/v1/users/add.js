const ApiError = require("../ApiError");
const jwt = require('jsonwebtoken');
const superConfig = require("../../../config/super").getConfig();
const crypto = require("crypto");
const { Users } = require("../../../core/sql/controller/child");
const {UniqueIdentifier: UniqueIdentifierRedis, UserBasicInfo: UserBasicInfoRedis, Tokens: TokensRedis} = require("../../../core/redis");
const salt = 'sads7hgGDgd7FDH='

const add = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.validateRequest = async(req, res, next) => {
  const { email, password, options } = req.body;
  if(!options || !email || !password) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.registerUser = async(req, res, next) => {
  req.body.password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('base64');
  const iTokensRedis = new TokensRedis(req._siteId);
  req._iTokensRedis = iTokensRedis;
  const UsersObj = new Users(req._siteId);
  UsersObj.checkEmail(req.body.email, (err, emailRes) => {
    if(emailRes && emailRes.email) return next(new ApiError(404, 'E0010007', {}, 'Invalid response!'));
    UsersObj.addUser(req.body, (err, response) => {
      req._userId = response[0];
      next();
    })
  })
}

add.generateToken = async(req, res, next) => {
  const token = jwt.sign({ id: req._userId }, superConfig["JWT"]["SECRET"].format({siteId: req._siteId}), {});
  await req._iTokensRedis.saveSSO(token, req._userId);
  req._token = token;
  next();
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
add.sendResponse = async(req, res, next) => {
  res.status(200).send({token: req._token, userId: req._userId});
  next();
}

module.exports = add;