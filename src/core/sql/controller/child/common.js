const path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
let common = {}

common.uploadReady = async (fileName) => {
  return new Promise((resolve, reject) => {
    var result = {};
    let extName = path.extname(fileName);
    result.newFileName = uuidv4() + extName;
    result.newFilePath = `uploads/${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}`
    let uploadDir = `${process.cwd()}/public/${result.newFilePath}`;
  
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    console.log('UPLOAD READY RESULT=>',result)
    return resolve(result);
  })
}

module.exports = common;