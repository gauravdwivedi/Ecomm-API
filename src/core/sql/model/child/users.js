/**
* Module specific to admin:users table
*/

const TABLE_NAME = "users";
const FIELDS = {
  ID: "id",
  EMAIL: "email",
  PASSWORD: "password",
  FIRST_NAME: "first_name",
  LAST_NAME: "last_name",
  AVATAR: "avatar",
  STATUS: "status",
  IS_SUPERUSER: "is_superuser",
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