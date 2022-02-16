const {Menu} = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper")
const {Menu: {SCHEMA:{FIELDS: MENU_FIELDS}}} = require("../../../core/sql/model/child");

const getAll = {};

/**
* fetching menus 
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
getAll.fetch = (req, res, next) => {
  const menuObj = new Menu(req._siteId);
  menuObj.fetchForSite((error, response)=>{
    req._response = response;
    next();
  })
}

/**
* building response
* @param {*} req 
* @param {*} res 
* @param {*} next 
*/
getAll.buildResponse = (req, res, next) => {
  let _final = [];
  let childMap = new Map();
  req._response.forEach(_menu => {
    if(!_menu[MENU_FIELDS.PARENT_ID]){
      _final.push(_menu);
    }
    else{
      const _curr = childMap.get(_menu[MENU_FIELDS.PARENT_ID]) || [];
      _curr.push(_menu);
      childMap.set(_menu[MENU_FIELDS.PARENT_ID], _curr);
    }
  })
  _final.forEach(_menu => {
    delete _menu[MENU_FIELDS.PARENT_ID];
    const _child = childMap.get(_menu[MENU_FIELDS.ID]);
    if(Array.isArray(_child) && _child.length){
      _menu.child = {
        total: _child.length,
        list: _child.map(_obj => {
          delete _obj[MENU_FIELDS.PARENT_ID];
          return _obj;
        })
      }
    }
  })
  res.status(200).send(base.success({
   result:{
    total: _final.length,
    list: _final
   }
  }));
  next();
}

module.exports = getAll;