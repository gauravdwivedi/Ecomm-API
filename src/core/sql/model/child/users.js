/**
* Module specific to admin:users table
*/

const TABLE_NAME = "users";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  EMAIL: "email",
  PASSWORD: "password",
  FIRST_NAME: "first_name",
  LAST_NAME: "last_name",
  AVATAR: "avatar",
  STATUS: "status",
  ROLE: "role",
  EMAIL_VERIFIED: "email_verified",
  GENDER: "gender",
  DOB: "dob",
  PHONE: "phone",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at"
}

module.exports = {
  TABLE_NAME, FIELDS
};