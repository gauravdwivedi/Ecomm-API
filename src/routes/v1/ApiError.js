const errorCodes = require('./errorCodes');
const _ = require("lodash");

//TODO: extend Error class
class ApiError {
  /**
   *Creates an instance of ApiError.
   * @param {*} httpStatusCode HTTP status code to send in API response
   * @param {*} errorCode application error code
   * @param {*} options (optional)
   * @memberof ApiError
   */
  constructor(httpStatusCode, errorCode, options = {}) {
    this.httpStatusCode = httpStatusCode;
    this.errorCode = errorCode;
    this.options = options;
  }

  /**
   * Builds a json object as per the error schema defined for APIs
   */
  toJSON() {
    const _err = _.cloneDeep(errorCodes.errors[this.errorCode]);
    this.options.message && (_err.message = this.options.message);
    return {
      error: {
        ..._err,
        type: 'error',
        code: this.errorCode,
        errorData: _getErrorData(this.options),
        debug: _getDebugInfo(this.options)
      }
    };
  }
}

module.exports = ApiError;

function _getErrorData(options) {
  if(options && options.errorData && !(options.errorData instanceof Error)) {
    return options.errorData;
  }
  return;
}

function _getDebugInfo(options) {
  if(options && options.debug) {
    return options.debug;
  }
  return;
}