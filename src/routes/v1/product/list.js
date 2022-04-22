const { Product } = require("../../../core/sql/controller/child");
const { base } = require("./../../../wrapper");
const ApiError = require("../ApiError");
const list = {};


/**
* Validating JSON Body
* @param {*} req
* @param {*} res
* @param {*} next
*/
list.validateBody = (req, res, next) => {
  let { sort_by, order, category_id, page, limit } = req.query;
  if(!category_id) return next(new ApiError(400, 'E0010004'));
  if(!sort_by) req.query.sort_by = 'id';
  if(!order) req.query.order = 'desc';
  if(!limit) limit = 20;

  page = page ? Number(page) : 1;

  req.query.page = page;
  req.query.offset =(page-1)*Number(limit);
  req.query.limit = Number(limit);
  
  next();
}



/**
* Saving in MySQL
* @param {*} req
* @param {*} res
* @param {*} next
*/
list.productList = async (req, res, next) => {
  let { sort_by, order, min_price, max_price, category_id, offset, limit } = req.query;
  const ProdObj = new Product(req._siteId);

  ProdObj.list(sort_by, order, min_price, max_price, category_id, offset, limit, (error, result)=>{
    if(result && result.length){
      res.status(200).send(base.success({result}));
      next();
    } else if(error) {
      console.log(error);
      res.status(200).send(base.success({result: {}}));
      next();
    }
  })
}

module.exports = list;