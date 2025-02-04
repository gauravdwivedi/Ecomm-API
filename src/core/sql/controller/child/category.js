const AbstractSQL = require("../abstract");
const SqlString = require("sqlstring");
const {v4 : uuidv4} = require('uuid')
const {
  Category: {
    SCHEMA: { FIELDS: CATEGORY_FIELDS, TABLE_NAME: CATEGORY_TABLE_NAME },
  },
} = require("./../../model/child");

class Category extends AbstractSQL {
  constructor(siteId) {
    super(siteId);
    this.siteId = siteId;
    this.connection = super.connection();
  }

  /**
   * Add Category
   */
  addCategory(params, callback) {
    let id = uuidv4();
    this.connection
      .query(QUERY_BUILDER.SAVE(id, params), super.getQueryType("INSERT"))
      .then((result) => {
        callback(null, id);
      })
      .catch((error) => callback(error, null));
  }

  uploadIcon(params) {
    console.log("SQL ICON", params);
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.UPLOAD_ICON(params), super.getQueryType("UPDATE"))
        .then((result) => {
          return resolve(result);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Fetch List
   */
  fetchList(callback) {
    this.connection
      .query(QUERY_BUILDER.FETCH_LIST(), super.getQueryType("SELECT"))
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error, null));
  }

  /**
   * Fetch Detail
   */
  fetchDetail = (params) => {
    return new Promise((resolve, reject) => {
      this.connection
        .query(QUERY_BUILDER.FETCH_DETAIL(params), super.getQueryType("SELECT"))
        .then((result) => {
          console.log("result", result[0]);
          resolve(result && result[0] ? result[0] : {});
        })
        .catch((error) => reject(error));
    });
  };

  /**
   * Update Category Detail by ID
   */
  updateDetailByID(params, callback) {
    this.connection
      .query(
        QUERY_BUILDER.UPDATE_DETAIL_BY_ID(params),
        super.getQueryType("UPDATE")
      )
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error, null));
  }

  /**
   * Delete Category
   */
  deleteCategory(categoryId, callback) {
    this.connection
      .query(
        QUERY_BUILDER.DELETE_CATEGORY_BY_ID(categoryId),
        super.getQueryType("DELETE")
      )
      .then((result) => {
        callback(null, result);
      })
      .catch((error) => callback(error, null));
  }
}

const QUERY_BUILDER = {
  SAVE: (id,params) => {
    let { title, icon, slug } = params;
    const query = `INSERT INTO ${CATEGORY_TABLE_NAME}
    ( ${CATEGORY_FIELDS.ID}, ${CATEGORY_FIELDS.TITLE}, ${CATEGORY_FIELDS.ICON} , ${CATEGORY_FIELDS.SLUG}, ${CATEGORY_FIELDS.STATUS})
    VALUES(?,?,?,?,1)
    ON DUPLICATE KEY
    UPDATE ${CATEGORY_FIELDS.TITLE}=?`;
    let res = SqlString.format(query, [id, title, icon, slug, title]);
    console.log(res);
    return res;
  },
  UPLOAD_ICON: (params) => {
    console.log(params);
    let { path, id } = params;
    let data = [path, id];
    let query = `UPDATE ${CATEGORY_TABLE_NAME} SET ${CATEGORY_FIELDS.ICON} = ? WHERE ${CATEGORY_FIELDS.ID} = ?`;
    return SqlString.format(query, data);
  },

  FETCH_LIST: () => {
    const query = `SELECT * FROM ${CATEGORY_TABLE_NAME}`;
    return SqlString.format(query, []);
  },

  FETCH_DETAIL: (params) => {
    const {id, slug} = params;
    if(id) return SqlString.format(`SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE id=?`, [id]);
    else if(slug) return SqlString.format(`SELECT * FROM ${CATEGORY_TABLE_NAME} WHERE slug=?`, [slug]);
  },

  UPDATE_DETAIL_BY_ID: (params) => {
    let { title, icon, slug, categoryId } = params;
    let values = [];
    let query = `UPDATE ${CATEGORY_TABLE_NAME} `;
    if (title) {
      query += `SET ${CATEGORY_FIELDS.TITLE} = ? `;
      values.push(title);
    }
    if (icon) {
      query += title ? " , " : " SET ";
      query += ` ${CATEGORY_FIELDS.ICON} = ? `;
      values.push(icon);
    }

    if (slug) {
      query += icon ? " , " : " SET ";
      query += ` ${CATEGORY_FIELDS.SLUG} = ? `;
      values.push(slug);
    }

    query += ` WHERE ${CATEGORY_FIELDS.ID} = ?`;
    values.push(categoryId);
    return SqlString.format(query, values);
  },
  DELETE_CATEGORY_BY_ID: (categoryId) => {
    const query = `DELETE FROM ${CATEGORY_TABLE_NAME} WHERE ${CATEGORY_FIELDS.ID} = ?`;
    return SqlString.format(query, [categoryId]);
  },
};

module.exports = Category;
