const ApiError = require("../ApiError");
const jwt = require('jsonwebtoken');
const superConfig = require("../../../config/super").getConfig();
const {UniqueIdentifier: UniqueIdentifierRedis, UserBasicInfo: UserBasicInfoRedis, Tokens: TokensRedis} = require("../../../core/redis");
const { Users } = require("../../../core/sql/controller/child");
const crypto = require("crypto");
const salt = 'sads7hgGDgd7FDH='
const auth = {};

/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
auth.validateBody = (req, res, next) => {
  const { email, password} = req.body;
  if(!email || !password) return next(new ApiError(400, 'E0010002', {}, 'Invalid Email or Password!'));
  next();
}

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
auth.checkInSQL = async (req, res, next) => {
  req.body.password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('base64');
  const iTokensRedis = new TokensRedis(req._siteId);
  req._iTokensRedis = iTokensRedis;
  const UsersObj = new Users(req._siteId);
  UsersObj.login(req.body, (error, userData) => {
    if(userData){
      req._userId = userData.id;
      req._response = userData;
      next();
    }
    else return next(new ApiError(404, 'E0010007', {}, 'Invalid response!'));
  })
}

auth.generateToken = async(req, res, next) => {
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
auth.sendResponse = async(req, res, next) => {
  res.status(200).send({token: req._token, user: req._response});
  next();
}


module.exports = auth;