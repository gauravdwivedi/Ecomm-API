const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");
const common = require("../../../core/sql/controller/child/common");
const fs = require("fs");
const files = {};

files.validateRequest = async (req, res, next) => {
  // const { categoryId } = req.body;
  // if(!categoryId) next(new ApiError(400, 'E0010002', {}, 'Invalid request! Please check your inputs'));
  next();
};

/**
 * saving in db
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

files.uploadFiles = async (req, res, next) => {
  let myresult = [];
  if(req.files.datafiles.length) {
    for (let i = 0; i < req.files.datafiles.length; i++) {
      const datafile = req.files.datafiles[i];
      const tempPath = datafile.name;
      const result = await common.uploadReady(tempPath);
      let newPath = `${process.cwd()}/public/${result.newFilePath}/${result.newFileName}`;
      let newURL = `/${result.newFilePath}/${result.newFileName}`;
      datafile.mv(newPath, function(err) {
        err && console.error('file upload error', err);
      });
      myresult.push(newURL);
    }
  } else {
    const datafile = req.files.datafiles;
    const tempPath = datafile.name;
    const result = await common.uploadReady(tempPath);
    let newPath = `${process.cwd()}/public/${result.newFilePath}/${result.newFileName}`;
    let newURL = `/${result.newFilePath}/${result.newFileName}`;
    datafile.mv(newPath, function(err) {
      err && console.error('file upload error', err);
    });
    myresult.push(newURL);
  }
  req._response = myresult;
  next();
};

/**
 * sending response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
files.sendResponse = async (req, res, next) => {
  res.status(200).send({result: req._response});
  next();
};

module.exports = files;
