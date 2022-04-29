const ApiError = require("../ApiError");
const { Category } = require("../../../core/sql/controller/child")
const common = require("../../../core/sql/controller/child/common")
const fs = require("fs")
const path = require("path")
const upload = {};


/**
* saving in db
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/

upload.icon = async (req,res,next) => {
    console.log('REQ FILES',req)
    const tempPath = req.file.originalname;  
    console.log('Temp Path',tempPath)
    common.uploadReady(req.file.originalname).then((result) => {
        
        console.log( `${process.cwd()}`)
console.log('SQL RESULT',result)
        let newPath = `${process.cwd()}/public/${result.newFilePath}/${result.newFileName}`;
        fs.rename(tempPath, newPath, function (err) {
            
            if (err) throw err
            req.body.path = `${result.newFilePath}/${result.newFileName}`;
            Category.uploadIcon(req.body).then((detail) => {
              sendResponse(detail, req, res, next);
            }).catch((err) => {
              console.log(err);
              return next(new ApiError(404, 'E0010008', {}, err));
            })
          })
    }).catch((err)=>{
        console.log(err);
        return next(new ApiError(404, 'E0010008', {}, err));
    })
}

/**
* sending response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
upload.sendResponse = async(req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = upload;