const { Product, ProductImages, ProductVariants, ProductVideos, Category, ProductThumb, Cart,ProductSave,Orders,OrderDetails } = require("../../../core/sql/controller/child");
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
  let { sort_by, order, page, limit } = req.query;
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
  try {
    let { sort_by, order, min_price, max_price, category_id, category, size, color, offset, limit,search } = req.query;
    const userId = req._userId;
    const ProdObj = new Product(req._siteId);
    const ProdImageObj = new ProductImages(req._siteId);
    const ProdVariantObj = new ProductVariants(req._siteId);
    const ProdVideoObj = new ProductVideos(req._siteId);
    const CatObj = new Category(req._siteId);
    const prodThumbObj = new ProductThumb(req._siteId);
    const cartObj = new Cart(req._siteId);
    const favouriteList = new ProductSave(req._siteId);
    const OrderObj = new Orders(req._siteId);
    const OrderDetailsObj = new OrderDetails(req._siteId);

    if(search){
        console.log(search,'SEARCH')

    let userProductIds = [];
    if (req._userId) {
      let userOrders = await OrderObj.completedOrders(userId);
      const promises = userOrders.map(async (item) => {
        let temp = await OrderDetailsObj.orderDetailsByOrderId(item.id);
        if (temp) {
          item.details = temp;
          userProductIds = userProductIds.concat(temp.map(item => item.productId));
        } else {
          item.details = []
        }
      });
      await Promise.all(promises);
      userProductIds = Array.from(new Set(userProductIds));
    }
        ProdObj.search(search, async (error,result)=>{
          if(result && result.length){
            let myresult=[];

            for(let index=0;index<result.length;index++){
              let product = result[index];
          const category = await CatObj.fetchDetail({id: product.category});
          const attributes =  await ProdVariantObj.getProductVariants(product.id, size, color, min_price, max_price);
          const images = await ProdImageObj.getProductImages(product.id);
          const videos = await  ProdVideoObj.getProductVideos(product.id);
          const likesCount = await prodThumbObj.count(product.id);
          const likes = await  prodThumbObj.getLikesUserIds(product.id);
          const saved = await favouriteList.getFavouritesUserIds(product.id);
          myresult.push({ ...product, attributes, images, category, videos, likesCount, likes ,saved});
            }
      
        const cartList = (req._userId) ? await cartObj.listCart(userId) : [];
        const total = await ProdObj.count();
        // const saved = await favouriteList.list(userId)
        
        res.status(200).send(base.success({result: _wrapper(userId, req.query, myresult, total, cartList,userProductIds)}));
        next();
          
          }
        }) 
    }else{

    if(category) {
      let mycategory = await CatObj.fetchDetail({slug: category});
      category_id = await mycategory?.id
    }
    if(size && Array.isArray(JSON.parse(size))){
        size = JSON.parse(size).join('","')
    }

    let userProductIds = [];
    if (req._userId) {
      let userOrders = await OrderObj.completedOrders(userId);
      const promises = userOrders.map(async (item) => {
        let temp = await OrderDetailsObj.orderDetailsByOrderId(item.id);
        if (temp) {
          item.details = temp;
          userProductIds = userProductIds.concat(temp.map(item => item.productId));
        } else {
          item.details = []
        }
      });
      await Promise.all(promises);
      userProductIds = Array.from(new Set(userProductIds));
    }
    ProdObj.list(sort_by, order, min_price, max_price, category_id, size, offset, limit, async (error, result)=>{
      if(result && result.length){
        let myresult = [];
        for(let index = 0; index < result.length; index++) {
          let product = result[index];
          const category = await CatObj.fetchDetail({id: product.category});
          const attributes =  await ProdVariantObj.getProductVariants(product.id, size, color, min_price, max_price);
          const images = await ProdImageObj.getProductImages(product.id);
          const videos = await  ProdVideoObj.getProductVideos(product.id);
          const likesCount = await prodThumbObj.count(product.id);
          const likes = await  prodThumbObj.getLikesUserIds(product.id);
          const saved = await favouriteList.getFavouritesUserIds(product.id);
          myresult.push({ ...product, attributes, images, category, videos, likesCount, likes ,saved});
        };

        const cartList = (req._userId) ? await cartObj.listCart(userId) : [];
        const total = await ProdObj.count();
        // const saved = await favouriteList.list(userId)
        
        res.status(200).send(base.success({result: _wrapper(userId, req.query, myresult, total, cartList,userProductIds)}));
        next();
      } else if(error) {
        console.log(error);
        res.status(200).send(base.success({result: []}));
        next();
      } else {
        res.status(200).send(base.success({result: []}));
        next();
      }
    })
    }

  } catch(err) {
    console.error(err);
    res.status(200).send(base.error({result: []}));
  }
}

const _wrapper = (userId, params, responses, total, cartList,userProductIds) => {
  let productList = [];
  responses.map(product => {

    console.log(product.saved,'?? CartList',cartList)

    let tuple = {
      id: product.id,
      category: product.category,
      title: product.title,
      description: product.description,
      rating: product.rating,
      slug: product.slug, 
      attributes: product.attributes,
      images: product.images,
      videos: product.videos,
      likes: product.likesCount,
      liked: userId && product.likes.some( like => like.userId == userId ) ? true : false,
      productInCart: userId && cartList.some( cart => cart.productId == product.id ) ? true : false,
      favourite:userId && product.saved.some( fav => fav.userId == userId) ? true:false,
      isProductBought: userProductIds.includes(product.id )
    }
    productList.push(tuple);
  })

  const resp = {
    meta:{
      total: total || 0,
      pages: total ? Math.ceil(total/params.limit) : 0,
      currentPage: params.page
    },
    list: productList
  }
  return resp;
}

module.exports = list;