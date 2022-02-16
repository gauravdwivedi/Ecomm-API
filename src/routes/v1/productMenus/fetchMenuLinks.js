const ApiError = require("../ApiError");
const {ProductMenuEntity} = require("../../../core/sql/controller/child");
const {ProductMenuEntity: {FIELDS: PRODUCT_MENU_ENTITY_FIELDS}} = require("../../../core/sql/model/child");
const {Video: {SCHEMA: {FIELDS: VIDEO_FIELDS, TABLE_NAME: VIDEO_TABLE_NAME}}} = require("../../../core/sql/model/child");
const {Pages: {FIELDS: PAGES_FIELDS, TABLE_NAME: PAGES_TABLE_NAME}} = require("../../../core/sql/model/child");

const fetchMenuLinks = {};

fetchMenuLinks.validate = async(req, res, next) => {
  const {slug, productSlug} = req.query;

  if(!slug || !productSlug){
    return next(new ApiError(400, 'E0010002'));
  }
  next();
}

fetchMenuLinks.fetch = async(req, res, next) => {
  const {slug, productSlug} = req.query;

  try{
    req._list = await new ProductMenuEntity(req._siteId).fetchLinkedEntities(req._siteId, slug, productSlug);
  }catch(e){
    return next(new ApiError(500, 'E0010001', {debug: e}))
  }
  next();
}

fetchMenuLinks.buildResponse = async(req, res, next) => {
  req._list = req._list.map(_obj => {
    const _entityId = _obj[PRODUCT_MENU_ENTITY_FIELDS.ENTITY_ID];
    const _entityType = _obj[PRODUCT_MENU_ENTITY_FIELDS.ENTITY_TYPE];
    
    let _video = {}, _page = {};
    if(_entityType === 'video'){
      _video = {
        id: _obj[`${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.ID}`],
        name: _obj[`${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.NAME}`],
        description: _obj[`${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.DESCRIPTION}`] || "",
        thumbnail: _obj[`${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.THUMBNAIL}`],
        hls_public_url: _obj[`${VIDEO_TABLE_NAME}_${VIDEO_FIELDS.HLS_MASTER_PUBLIC_URL}`],
        captionUrl:_obj[VIDEO_FIELDS.CAPTION_URL],
      }
    }else if(_entityType === 'page'){
      _page = {
        id: _obj[`${PAGES_TABLE_NAME}_${PAGES_FIELDS.ID}`],
        name: _obj[`${PAGES_TABLE_NAME}_${PAGES_FIELDS.NAME}`],
        content: _obj[`${PAGES_TABLE_NAME}_${PAGES_FIELDS.CONTENT}`],
      }
    }
    return {
      id: _entityId,
      type: _entityType,
      order: _obj[PRODUCT_MENU_ENTITY_FIELDS.ORDER],
      entity: {
        video: _entityType === 'video' ? _video : undefined,
        page: _entityType === 'page' ? _page : undefined,
      }
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