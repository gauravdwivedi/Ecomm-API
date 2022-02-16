const ApiError = require("../ApiError");
const {LiveSessions} = require("../../../core/sql/controller/child");
const {LiveSessions: {FIELDS: LIVE_SESSIONS_FIELDS}} = require("../../../core/sql/model/child");
const {Product: {SCHEMA: {FIELDS: PRODUCT_FIELDS, TABLE_NAME: PRODUCT_TABLE_NAME}}} = require("../../../core/sql/model/child");
const {AdminUsers: {FIELDS: ADMIN_USERS_FIELDS, TABLE_NAME: ADMIN_USERS_TABLE_NAME}} = require("../../../core/sql/model/child");

const list = {};

list.validate = (req, res, next) => {
  next();
}

list.fetch = async(req, res, next) => {
  try{
    req._response = await new LiveSessions(req._siteId).fetchSessions(req._siteId) || [];
    next();
  }catch(e){
    return next(new ApiError(500, 'E0010001', {debug: e}))
  }
}

list.sendResponse = (req, res, next) => {
  const list = req._response.map(_obj => {
    return {
      sessionId: _obj[LIVE_SESSIONS_FIELDS.SESSION_ID],
      product: {
        id: _obj[LIVE_SESSIONS_FIELDS.PRODUCT_ID],
        name: _obj[`${PRODUCT_TABLE_NAME}_${PRODUCT_FIELDS.NAME}`],
        description: _obj[`${PRODUCT_TABLE_NAME}_${PRODUCT_FIELDS.DESCRIPTION}`],
        images: (_obj[`${PRODUCT_TABLE_NAME}_${PRODUCT_FIELDS.IMAGES}`] || "").split(', '),
        mobileImages: (_obj[`${PRODUCT_TABLE_NAME}_${PRODUCT_FIELDS.MOBILE_IMAGES}`] || "").split(', '),
      },
      host: {
        id: _obj[LIVE_SESSIONS_FIELDS.HOST_USER_ID],
        firstName: _obj[`${ADMIN_USERS_TABLE_NAME}_${ADMIN_USERS_FIELDS.FIRST_NAME}`],
        lastName: _obj[`${ADMIN_USERS_TABLE_NAME}_${ADMIN_USERS_FIELDS.LAST_NAME}`],
      },
      scheduledDuration: _obj[LIVE_SESSIONS_FIELDS.SCHEDULED_DURATION],
      scheduledAt: _obj[LIVE_SESSIONS_FIELDS.SCHEDULED_AT],
      status: _obj[LIVE_SESSIONS_FIELDS.STATUS],
      title: _obj[LIVE_SESSIONS_FIELDS.TITLE],
      description: _obj[LIVE_SESSIONS_FIELDS.DESCRIPTION],
    }
  });

  res.status(200).send({
    total: list.length,
    count: list.length,
    list: list,
  });
  next()
}

module.exports = list;