const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child");
const common = require("../../../core/sql/controller/child/common");
const fs = require("fs");
const path = require("path");
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

  console.log("REQ FILES", req);
  const tempPath = req.file.originalname;
  console.log("Temp Path", tempPath);
  common
    .uploadReady(req.file.originalname)
    .then(async (result) => {
      console.log(`WHAT IS THIS => ${process.cwd()}`);
      console.log("SQL RESULT", result);

      let newPath = `${process.cwd()}/public/${result.newFilePath}/${
        result.newFileName
      }`;

      let res = await fs.writeFileSync(req.file.originalname, req.file.buffer);

      console.log("WRITERESPONSEEE", res);

      fs.rename(tempPath, newPath, function (err) {
        if (err) throw err;

        req.body.path = `${result.newFilePath}/${result.newFileName}`;

        CategoryObj.uploadIcon(req.body)
          .then((detail) => {
            console.log("UPLOAD DETAIL", detail);
            req._response = detail;
            next();
          })
          .catch((err) => {
            console.log(err);
            return next(new ApiError(404, "E0010008", {}, err));
          });
      });
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
