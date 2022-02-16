/**
* Module specific to live_sessions table
*/

const TABLE_NAME = "live_sessions";
const FIELDS = {
  ID: "id",
  SITE_ID: "site_id",
  SESSION_ID: "session_id",
  PRODUCT_ID: "product_id",
  SCHEDULED_AT: "scheduled_at",
  HOST_USER_ID: "host_user_id",
  CREATED_AT: "created_at",
  UPDATED_AT: "updated_at",
  CREATED_BY: 'created_by',
  UPDATED_BY: 'updated_by',
  STATUS: "status",
  TITLE: "title",
  DESCRIPTION: "description",
  SCHEDULED_DURATION: "scheduled_duration",
  DURATION: "duration",
  TOTAL_COMMENTS: "total_comments",
  TOTAL_USERS: "total_users",
}

module.exports = {
  TABLE_NAME, FIELDS
};