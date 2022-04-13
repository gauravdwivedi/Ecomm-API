const ApiError = require("../ApiError");
const { Users } = require("../../../core/sql/controller/child");
const crypto = require("crypto");const salt = 'sads7hgGDgd7FDH='

const changePassword = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
changePassword.validateRequest = async(req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
changePassword.changePassword = async(req, res, next) => {
  req.body.password = crypto.pbkdf2Sync(req.body.password, salt, 10000, 64, 'sha512').toString('base64');
  req.body.newPassword = crypto.pbkdf2Sync(req.body.newPassword, salt, 10000, 64, 'sha512').toString('base64');
  const UsersObj = new Users(req._siteId);
  UsersObj.checkEmail(req.body.email, (err, response) => {
    if(response && response.email) {
      if(response.password != req.body.password) return next(new ApiError(400, 'E0010002', {}, 'Passwords not same'));
      UsersObj.changePassword(req.body, (err, newResponse) => {
        req._response = newResponse;
        next();
      })
    }
  })
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
changePassword.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = changePassword;