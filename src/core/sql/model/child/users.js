/**
* Module specific to admin:users table
*/

const TABLE_NAME = "users";
const FIELDS = {
  ID: "id",
  SITE_ID: "siteId",
  EMAIL: "email",
  PASSWORD: "password",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  AVATAR: "avatar",
  STATUS: "status",
  ROLE: "role",
  EMAIL_VERIFIED: "emailVerified",
  GENDER: "gender",
  DOB: "dob",
  PHONE: "phone",
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt"
}

module.exports = {
  TABLE_NAME, FIELDS
};