const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");
const common = require("../../../core/sql/controller/child/common");
const upload = {};

upload.validateRequest = async (req, res, next) => {
  const { categoryId } = req.body;
  if (!categoryId)
    next(
      new ApiError(
        400,
        "E0010002",
        {},
        "Invalid request! Please check your inputs"
      )
    );
  next();
};

/**
 * saving in db
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

upload.icon = async (req, res, next) => {
  const CategoryObj = new Category(req._siteId);
  const datafile = req.files.datafile;
  const tempPath = datafile.name;
  const result = await common.uploadReady(tempPath);
  let newPath = `${process.cwd()}/public/${result.newFilePath}/${result.newFileName}`;
  req.body.path = `/${result.newFilePath}/${result.newFileName}`;
  datafile.mv(newPath, function(err) {
    err && console.error('file upload error', err);
  });
  CategoryObj.uploadIcon(req.body).then((detail) => {
    console.log("UPLOAD DETAIL", detail);
    req._response = detail;
    next();
  })
  .catch((err) => {
    console.log(err);
    return next(new ApiError(404, "E0010008", {}, err));
  });
};

/**
 * sending response
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
upload.sendResponse = async (req, res, next) => {
  res.status(200).send(req._response);
  next();
};

module.exports = upload;
