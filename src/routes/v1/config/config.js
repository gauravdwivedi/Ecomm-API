const { ChildCredentials } = require("../../../core/sql/controller/super");

const config = {};

/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
config.getFromSQL = async (req, res, next) => {
  const siteId = req.headers['site-id'];
  const result = await new ChildCredentials().fetchForSite(siteId);
  const response = result && result.logo && _wrapper(result);
  res.status(200).send({response});
}

const _wrapper = (resp) => {
  const result = {
    logo: resp?.logo,
    siteName: resp?.site_name,
    themeColor: resp?.theme_color,
    mediaUrl: resp?.media_url
  }
  return result;
}


module.exports = config;