const superConfig = require("../../config/super").getConfig();

const COOKIE_NAME_SSO_TOKEN = "SSO_TOKEN";
const COOKIE_NAME_SIGN_UP_TOKEN = "SIGN_UP_TOKEN";
const COOKIE_OPTIONS = {
  domain: superConfig.COOKIE_DOMAIN,
  secure: false,
  httpOnly: true
};

const cookieHelper = {};

cookieHelper.COOKIE_NAME_SSO_TOKEN = COOKIE_NAME_SSO_TOKEN;
cookieHelper.COOKIE_NAME_SIGN_UP_TOKEN = COOKIE_NAME_SIGN_UP_TOKEN;
cookieHelper.COOKIE_OPTIONS = COOKIE_OPTIONS;

cookieHelper.setUserSSOTokenCookie = (res, ssoToken) => {
  res.cookie(COOKIE_NAME_SSO_TOKEN, ssoToken, {
    sameSite: 'none', 
    secure: false
  });
  return;
}

cookieHelper.setUserSignUpTokenCookie = (res, ssoToken) => {
  res.cookie(COOKIE_NAME_SIGN_UP_TOKEN, ssoToken, {
    sameSite: 'none', 
    secure: false
  });
  return;
}

cookieHelper.clearCookie = (res, name) => {
  res.clearCookie(name, COOKIE_OPTIONS);
  return;
}

module.exports = cookieHelper;
