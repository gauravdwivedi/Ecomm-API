/**
* Module specific to admin:users table
*/

const TABLE_NAME = "admin:users";
const FIELDS = {
  ID: "id",
  EMAIL: "email",
  PASSWORD: "password",
  FIRST_NAME: "first_name",
  LAST_NAME: "last_name",
  ROLE: "role",
  STATUS: "status",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at"
}

const FIELDS_VALUES = {
  STATUS: {
    INACTIVE: 0,
    ACTIVE: 1,
    DELETED: 2
  }
}

module.exports = {
  TABLE_NAME, FIELDS, FIELDS_VALUES
};