const { base } = require("./../../../wrapper")
const {generateSignedUrl} = require("./../../../services/storage");
const ApiError = require("../ApiError");

const action = {};


action.validateRequest = async(req, res, next) => {
  const {filename, type} = req.query;
  
  if(typeof filename !== 'string') return next(new ApiError(400, 'E0010002', {
    debug: 'filename is missing/invalid'
  }))
  
  if(!['review', 'avatar'].includes(type)) return next(new ApiError(400, 'E0010002', {
    debug: 'type is missing/invalid'
  }))
  next();
}

action.generateSignedUrl = async (req, res, next) => {
  const userId = req._userId;
  const {filename, type} = req.query;
  generateSignedUrl(req._siteId, userId, type, filename).then((resp)=>{
    res.status(200).send(base.success({result: resp}));
    next();
  })
}


module.exports = action;
