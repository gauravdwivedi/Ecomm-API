const C = require("../../../constants");

const config = {};

config.initialize = (req, res, next) => {
  req._response = {};
  next();
}

config.addGender = (req, res, next) => {
  const _gender = [];
  Object.values(C.ALLOWED_GENDERS).forEach(_gen => {
    _gender.push({
      slug: _gen,
      label: C.GENDERS_LABEL[_gen]
    })
  })
  req._response["gender"] = _gender;
  next();
}

config.sendResponse = (req, res, next) => {
  res.status(200).send(req._response);
  next();
}

module.exports = config;