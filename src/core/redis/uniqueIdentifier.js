const moment = require('moment');
const key = require("./keys");

const AbsractRedis = require("./abstract");

class UniqueIdentifier extends AbsractRedis{
  constructor(siteId){
    super(siteId);
  }
  
  /**
  * Saving email unique indentiofier
  * @param {*} email email
  * @param {*} userId userId
  */
  async save(email, userId){
    const _key = key.UNIQUE_INDENTIFIER_EMAIL.format({email});
    await super.asyncHmset(_key, {
      user_id: userId,
      iat: moment().unix()
    });
    return;
  }
  
  /**
  * fetching userId from unique identifier
  * @param {*} email 
  */
  async isAlreadyRegistered(email){
    const _key = key.UNIQUE_INDENTIFIER_EMAIL.format({email});
    return await super.asyncHget({
      key: _key,
      field: "user_id"
    });
  }
  
  /**
  * invalidating key
  * @param {*} email 
  */
  async invalidate(email){
    const _key = key.UNIQUE_INDENTIFIER_EMAIL.format({email});
    super.del(_key, () => {});
    return;
  }
}

module.exports = UniqueIdentifier;