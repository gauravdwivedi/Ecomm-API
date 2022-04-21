const moment = require('moment');
const key = require("./keys");
const async = require("async");
const AbsractRedis = require("./abstract");

const HASH_FIELDS = {
  USER_ID: 'user_id',
  EMAIL: 'email',
  PASSWORD: 'password',
  FIRST_NAME: 'first_name',
  LAST_NAME: 'last_name',
  GENDER: 'gender',
  DOB: 'dob',
  PHONE: 'phone',
  ROLE: 'role',
  STATUS: 'status',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at'
}

class UserBasicInfo extends AbsractRedis{
  constructor(siteId){
    super(siteId);
  }
  
  HASH_FIELDS(){
    return HASH_FIELDS;
  }
  
  /**
  * saving user basic info
  * @param {*} userId 
  * @param {*} options 
  */
  async save(userId, options = {}){
    const _key = key.USER_BASIC_INFO.format({userId});
    const _toAdd = {
      [HASH_FIELDS.USER_ID]: userId,
      [HASH_FIELDS.EMAIL]: options[HASH_FIELDS.EMAIL],
      [HASH_FIELDS.PASSWORD]: options[HASH_FIELDS.PASSWORD],
      [HASH_FIELDS.FIRST_NAME]: options[HASH_FIELDS.FIRST_NAME],
      [HASH_FIELDS.LAST_NAME]: options[HASH_FIELDS.LAST_NAME],
      [HASH_FIELDS.PHONE]: options[HASH_FIELDS.PHONE],
      [HASH_FIELDS.ROLE]: options[HASH_FIELDS.ROLE],
      [HASH_FIELDS.CREATED_AT]: options[HASH_FIELDS.CREATED_AT],
      [HASH_FIELDS.UPDATED_AT]: options[HASH_FIELDS.UPDATED_AT],
    };
    await super.asyncHmset(_key, _toAdd);
    return;
  }
  
  /**
  * fetching user basic info
  * @param {*} userId 
  */
  async getAllUserInfo(userId){
    const _key = key.USER_BASIC_INFO.format({userId});
    return await super.asyncHgetall(_key);
  }

  async getUserShortDetail(userId){
    return new Promise((resolve, reject) => {
      const _key = key.USER_BASIC_INFO.format({userId});
      super.asyncHgetall(_key).then(userData=>{
        const userDetails = userData ? {
          [HASH_FIELDS.USER_ID]: userData[HASH_FIELDS.USER_ID],
          [HASH_FIELDS.EMAIL]: userData[HASH_FIELDS.EMAIL],
          [HASH_FIELDS.FIRST_NAME]: userData[HASH_FIELDS.FIRST_NAME],
          [HASH_FIELDS.LAST_NAME]: userData[HASH_FIELDS.LAST_NAME],
          [HASH_FIELDS.GENDER]: userData[HASH_FIELDS.GENDER],
          [HASH_FIELDS.DOB]: userData[HASH_FIELDS.DOB],
          [HASH_FIELDS.PHONE]: userData[HASH_FIELDS.PHONE],
          [HASH_FIELDS.ROLE]: userData[HASH_FIELDS.ROLE],
        }: {}
        return resolve(userDetails);
      });
    })
  }

  async getAllUsersProfile(userIds){
    return new Promise ((resolve, reject) => {
      let map = new Map();
      let scripts = userIds.map(el => cb => {
        this.getUserShortDetail(el).then(shortDetail => {
          shortDetail && map.set(el, shortDetail);
          cb()
        })
      })
      async.parallelLimit(scripts, 10, () => {
        resolve(map)
      })
    })
  }
  
  /**
  * updating the password
  * @param {*} userId 
  * @param {*} password 
  */
  async updatePassword(userId, password){
    const _key = key.USER_BASIC_INFO.format({userId});
    return await super.asyncHmset(_key, {
      [HASH_FIELDS.PASSWORD]: password,
    })
  }
  
  /**
  * updating the user
  * @param {*} userId 
  * @param {*} options 
  */
  async updateUser(userId, options = {}){
    if(!Object.keys(options).length) return;
    
    const _key = key.USER_BASIC_INFO.format({userId});

    const _toUpdate = {};
    if(options[HASH_FIELDS.FIRST_NAME]) _toUpdate[HASH_FIELDS.FIRST_NAME] = options[HASH_FIELDS.FIRST_NAME];
    if(options[HASH_FIELDS.LAST_NAME]) _toUpdate[HASH_FIELDS.LAST_NAME] = options[HASH_FIELDS.LAST_NAME];
    if(options[HASH_FIELDS.GENDER]) _toUpdate[HASH_FIELDS.GENDER] = options[HASH_FIELDS.GENDER];
    if(options[HASH_FIELDS.PHONE]) _toUpdate[HASH_FIELDS.PHONE] = options[HASH_FIELDS.PHONE];
    if(options[HASH_FIELDS.DOB]) _toUpdate[HASH_FIELDS.DOB] = options[HASH_FIELDS.DOB];

    return await super.asyncHmset(_key, _toUpdate);
  }
}

module.exports = UserBasicInfo;