
const AbstractSQL = require("../abstract");
const SqlString = require('sqlstring');

const {
  ProductImages: {SCHEMA:{FIELDS: PRODUCT_IMAGES_FIELDS, TABLE_NAME: PRODUCT_IMAGES_TABLE_NAME}},
} = require("../../model/child");

class ProductImages extends AbstractSQL{
  constructor(siteId){
    super(siteId);
    this.connection = super.connection();
  }
  
  saveProductImages(productId, images) {
    return new Promise((resolve, reject) => {
      let a = [];
      images.map(image => {
        this.connection.query(QUERY_BUILDER.SAVE_PRODUCT_IMAGES(productId, image), super.getQueryType('INSERT')).then(result => {
          a.push(result && result[0] ? result[0] : "");
        }).catch(error => console.log(error));
      })
      resolve(a);
    })
  }

  getProductImages(product_id) {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.GET_PRODUCT_IMAGES(product_id), super.getQueryType('SELECT')).then(result => {
        resolve(result)
      }).catch(error => reject(error));
    })
  }

  deleteProductImage = (image_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_IMAGE(image_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }

  deleteProductImagesByProductId = (product_id) => {
    return new Promise((resolve, reject) => {
      this.connection.query(QUERY_BUILDER.DELETE_PRODUCT_IMAGES_BY_PRODUCT_ID(product_id), super.getQueryType('DELETE')).then(result => {
        resolve(result);
      }).catch(error => reject(error));
    })
  }
}

const QUERY_BUILDER = {
  SAVE_PRODUCT_IMAGES: (product_id, url) => {
    const data = {
      [PRODUCT_IMAGES_FIELDS.PRODUCT_ID] : product_id,
      [PRODUCT_IMAGES_FIELDS.URL] : url,
      [PRODUCT_IMAGES_FIELDS.STATUS] : 1,
    }
    return SqlString.format(`INSERT INTO ${PRODUCT_IMAGES_TABLE_NAME} SET ${ [PRODUCT_IMAGES_FIELDS.ID]} = MD5(RAND()) , ? ?`, data)
  },

  GET_PRODUCT_IMAGES: (product_id) => {
    const query = ` SELECT ${PRODUCT_IMAGES_FIELDS.URL},${PRODUCT_IMAGES_FIELDS.ID}
      FROM ${PRODUCT_IMAGES_TABLE_NAME}
      WHERE ${PRODUCT_IMAGES_FIELDS.PRODUCT_ID} = ${product_id}`;
    return SqlString.format(query, [])
  },

  DELETE_PRODUCT_IMAGE: (imageId) => {
    const query = `DELETE FROM ${PRODUCT_IMAGES_TABLE_NAME}
      WHERE ${PRODUCT_IMAGES_FIELDS.ID} = ?`;
    
    const queryParams = [imageId];
    return SqlString.format(query, queryParams)
  },

  DELETE_PRODUCT_IMAGES_BY_PRODUCT_ID: (id) => {
    const query = `DELETE FROM ${PRODUCT_IMAGES_TABLE_NAME} WHERE ${PRODUCT_IMAGES_FIELDS.PRODUCT_ID} = ${id}`;
    return SqlString.format(query, [])
  }  
}





module.exports = ProductImages;
