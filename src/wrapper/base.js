const success = (options = {}) => {
  const {message = "success", result = {}} = options;
  return {
    status : {
      error: 0,
      message
    },
    result
  }
}

const error = (options = {}) => {
  const {message = "Something went wrong", error = {}, code} = options;
  return {
    status : {
      error: 1,
      code,
      message,
      error
    },
    result : {}
  }
}
module.exports = {
  success, error
}