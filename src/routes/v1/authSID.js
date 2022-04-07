const moment = require("moment");

module.exports = async (req, res, next) => {
  console.log(`[${moment().format("YYYY-MM-DD hh:mm:ss")}]`, "URL & PARAMS", req.url, req.query, req.headers["token"] ? {"token": req.headers["token"]} : {}, req.method, JSON.stringify(req.body));

  const siteId = req.headers['site-id'];  
  if(!siteId) return res.status(401).send();
  next();
}
