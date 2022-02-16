let randToken = require("rand-token");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('hoppedIn-secret-key');

const tokenHelper = {};

tokenHelper.generate = (email) => {
  return cryptr.encrypt(email);
}

tokenHelper.decrypt = (token) => {
  return cryptr.decrypt(token);
}

module.exports = tokenHelper;