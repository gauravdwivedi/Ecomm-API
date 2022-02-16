const RedisConnection = require("./connection");
const superConfig = require("../../config/super");
const childConfig = require("../../config/configs");

class Redis{
  constructor(siteId){
    const config = siteId ? childConfig.REDIS_CREDENTIALS(siteId) : superConfig.getSuperRedisConfigs();
    this.client = RedisConnection.getInstance(config);
  }

  set(key, value, callback){
    if (this.client) {
      this.client.set(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis client", null);
    }
  }

  get(key, callback){
    if (this.client) {
      this.client.get(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  del(key, callback){
    if (this.client) {
      this.client.del(key, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  keys(pattern, callback){
    
    if (this.client) {
      this.client.keys(pattern, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  scan(cursor, pattern, count, callback){
    
    if (this.client) {
      this.client.scan(cursor, 'MATCH',pattern,'COUNT', count, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  hset(hash, callback){
    
    if (this.client && hash.key && hash.field) {
      this.client.hset(hash.key, hash.field, hash.value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  hget(hash, callback){
    
    if (this.client && hash.key && hash.field) {
      this.client.hget(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  mget(keys, callback){
    
    if (this.client) {
      this.client.mget(keys, (error, reply) => {
        return callback(error, reply);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  asyncMgetasync (keys){
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.mget(keys, (error, result) => {
          if (error || !result) {
            reject('not found')
          }
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    })
  }
  
  hmset(key, values, callback){
    if (this.client && key && values && Object.keys(values).length > 0) {
      this.client.hmset(key, values, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }

  asyncHmset(key, values){
    return new Promise((resolve, reject) => {
      if (this.client && key && values && Object.keys(values).length > 0) {
        this.client.hmset(key, values, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      } else {
        return reject("error in getting redis this.client or key/values is invalid", null);
      }
    })
  }

  asyncHget(hash){
    return new Promise((resolve, reject) => {
      if (this.client && hash.key && hash.field) {
        this.client.hget(hash.key, hash.field, (error, result) => {
          if(error) return reject(error);
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    })
  }

  hmget(key, fields, callback){
    if (this.client && key && fields && Array.isArray(fields) && fields.length > 0) {
      this.client.hmget(key, fields, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }

  hdel(hash, callback){
    if (this.client && hash.key && hash.field) {
      this.client.hdel(hash.key, hash.field, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  zadd(sortedSet, callback){
    const { key, value, score } = sortedSet;
    if (this.client && key && value && score) {
      this.client.zadd(key, score, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }

  zrange(sortedSet, callback){
    const { key, start, stop } = sortedSet;
    if (this.client && key && !isNaN(start) && !isNaN(stop)) {
      this.client.zrange(key, start, stop, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }

  zrevrange(sortedSet, callback){
    const { key, start, stop } = sortedSet;
    if (this.client && key && !isNaN(start) && !isNaN(stop)) {
      this.client.zrevrange(key, start, stop, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }

  hkeys(key, callback){
    if (this.client && key) {
      this.client.hkeys(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client or key/values is invalid", null);
    }
  }
  asyncHkeys(key){
    return new Promise((resolve, reject) => {
      if (this.client && key) {
        this.client.hkeys(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client or key/values is invalid")
      }
    })
  }
  asyncHget(hash){
    return new Promise((resolve, reject) => {
      if (this.client && hash.key && hash.field) {
        this.client.hget(hash.key, hash.field, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }
  asyncLpush({ key, value }){
    return new Promise((resolve, reject) => {
      if (this.client && key && value) {
        this.client.LPUSH(key, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }
  asyncLRANGE({ key, i, j }){
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.LRANGE(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }
  asyncPOP({ key }){
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.LPOP(key, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }
  asyncLTRIM({ key, i, j }){
    return new Promise((resolve, reject) => {
      if (this.client) {
        this.client.LTRIM(key, i, j, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }

  asyncHgetall(key){
    return new Promise((resolve, reject) => {
      if (this.client && key) {
        this.client.hgetall(key, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    })
  }

  incr(key, callback){
    if (this.client) {
      this.client.incr(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  lpush(key, value, callback){
    if (this.client && key) {
      this.client.LPUSH(key, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  lrange(key, callback){
    if (this.client && key) {
      this.client.LRANGE(key, 0, -1, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  hincrby(key, field, incrementBy, callback){
    if (this.client && key && field && typeof incrementBy === 'number') {
      this.client.hincrby(key, field, incrementBy, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback();
    }
  }

  sadd(key, value, callback){
    if (this.client && key) {
      this.client.sadd(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  srem(key, value, callback){
    if (this.client && key) {
      this.client.srem(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  sismember(key, value, callback){
    if (this.client && key) {
      this.client.sismember(key, value, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  smembers(key, callback){
    if (this.client && key) {
      this.client.smembers(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  asyncSetex(key, TTL, value){
    return new Promise((resolve, reject) => {
      if (this.client && key && TTL && value) {
        this.client.SETEX(key, TTL, value, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    });
  }

  setex(key, expiry, value, callback){
    if (this.client) {
      this.client.setex(key, expiry, JSON.stringify(value), (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  //total members count
  scard(key, callback){
    if (this.client && key) {
      this.client.scard(key, (error, result) => {
        return callback(error, result);
      });
    } else {
      return callback("error in getting redis this.client", null);
    }
  }

  expire(key, TTL){
    return new Promise((resolve, reject) => {
      if (this.client && key) {
        this.client.expire(key, TTL, (error, result) => {
          return resolve(result);
        });
      } else {
        return reject("error in getting redis this.client");
      }
    })
  }
}

module.exports = Redis