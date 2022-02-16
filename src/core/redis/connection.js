const redis = require("redis");

/**
* Redis RedisConnection
*/
let RedisConnection = (() => {
    let client;
    return {
        getInstance: (config) => {
            if (!client) {
                let createClientObj = {port: config.PORT, host: config.HOST};
                if(config.PASSWORD) createClientObj = {...createClientObj, password:config.PASSWORD};
                client = redis.createClient(createClientObj);
                client.on("error", (err) => {
                    console.error("Error in redis:", err);
                });
            }
            return client;
        },
        
        initialize: () => {
            return RedisConnection.getInstance();
        }
    };
})();

module.exports = RedisConnection;
