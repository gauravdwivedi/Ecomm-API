const ApiError = require('./ApiError');

module.exports = (err, req, res, next) => {
  if(err instanceof ApiError) {
    return res.status(err.httpStatusCode).json(err);
  }
  console.log('[Error] API error', err);
  res.status(500).json(new ApiError(500, 'E0010002', {debug: err}));
};

