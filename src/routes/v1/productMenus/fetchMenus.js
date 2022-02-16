const ApiError = require("../ApiError");
const {ProductMenus} = require("../../../core/sql/controller/child");
const {ProductMenuEntity: {FIELDS: PRODUCT_MENU_ENTITY_FIELDS}} = require("../../../core/sql/model/child");
const {ProductMenus: {FIELDS: PRODUCT_MENUS_FIELDS}} = require("../../../core/sql/model/child");
const {Video: {SCHEMA: {FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}}} = require("../../../core/sql/model/child");
const {Pages: {FIELDS: PAGES_FIELDS, TABLE_NAME: PAGES_TABLE_NAME}} = require("../../../core/sql/model/child");

const fetchMenuLinks = {};

fetchMenuLinks.validate = async(req, res, next) => {
  const {slug} = req.query;

  if(!slug){
    return next(new ApiError(400, 'E0010002'));
  }
  next();
}

fetchMenuLinks.fetch = async(req, res, next) => {
  const {slug} = req.query;

  try{
    req._list = await new ProductMenus(req._siteId).fetchForProduct(req._siteId, slug);
  }catch(e){
    return next(new ApiError(500, 'E0010001', {debug: e}))
  }
  next();
}

fetchMenuLinks.buildResponse = async(req, res, next) => {
  req._list = req._list.map(_obj => {
    return {
      id: _obj[PRODUCT_MENUS_FIELDS.ID],
      name: _obj[PRODUCT_MENUS_FIELDS.NAME],
      pivot: _obj[PRODUCT_MENUS_FIELDS.PIVOT],
      slug: _obj[PRODUCT_MENUS_FIELDS.SLUG],
      order: _obj[PRODUCT_MENUS_FIELDS.ORDER],
    }
  })
  res.status(200).send({
    total: req._list.length,
    count: req._list.length,
    list: req._list
  });
  next();
}

module.exports = fetchMenuLinks;