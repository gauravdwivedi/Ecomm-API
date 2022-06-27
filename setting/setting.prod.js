const settings = {
  "config": {
    "ENV": process.env["NODE_ENV"] || "prod",
    "PORT": process.env["PORT"],
    "COOKIE_DOMAIN": process.env["COOKIE_DOMAIN"],
    "LOG": {
      "PATH": process.env["LOG_PATH"],
      "LEVEL": process.env["LOG_LEVEL"] || "info"
    },
    "REDIS":{
      "PORT":process.env["REDIS:PORT"],
      "HOST":process.env["REDIS:HOST"],
      "PASSWORD":process.env["REDIS:PASSWORD"]
    },
    "SQL":{
      "HOST":process.env["SQL:HOST"],
      "PORT":process.env["SQL:PORT"],
      "USERNAME":process.env["SQL:USERNAME"],
      "PASSWORD":process.env["SQL:PASSWORD"],
      "DB_NAME":process.env["SQL:DB_NAME"],
      "DIALECT":process.env["SQL:DIALECT"],
    },
    "RAZORPAY": {
      "KEY_ID": process.env['RAZORPAY:KEY_ID'],
      "KEY_SECRET": process.env['RAZORPAY:KEY_SECRET'],
    },
    "JWT": {
      "SECRET": process.env["JWT:SECRET"]
    }
  }
};

module.exports = settings;


module.exports = settings;
