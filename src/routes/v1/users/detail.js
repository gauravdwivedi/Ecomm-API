const ApiError = require("../ApiError");
const { Users } = require("../../../core/sql/controller/child");

const detail = {};

/**
* validating request body
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.validateRequest = async(req, res, next) => {
  const { userId } = req.body;
  if(!userId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
}

/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.getUserDetail = async(req, res, next) => {
  const { userId } = req.body;
  const UsersObj = new Users(req._siteId);
  // UsersObj.fetchDetailByID(userId, (err, detail) => {
  //   req._response = detail;
  //   next();
  // })

  UsersObj.getUserDetail(userId,(err,detail) => {
    req._response=detail;
    next();
  })

}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
detail.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = detail;