require("./setting/loadSetting").initializeEnvironmentSettings();

const config = require("./src/config/super").getConfig();
let express = require("express");

let cookieParser = require('cookie-parser');
const cors = require("cors");

const multer = require('multer');

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
})

let app = express();
app.use(cookieParser());

const session = require('express-session');
const sessionConfig = {
  secret: 'MYSECRET',
  name: 'hoppedIn',
  resave: false,
  saveUninitialized: false,
  cookie : {
    sameSite: 'none',
  }
};
app.use(session(sessionConfig));

app.disable('x-powered-by')
app.use(multerMid.single('file'))


app.options("*", cors());

app.get("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});
app.post("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});
app.patch("/", (req, res) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
});


const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: "10mb"})); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true, limit: "10mb"})); // support encoded bodies


app.use('/api/v1', require("./src/routes/v1"));

const port = config.PORT || 4000;
app.listen(port,() => {
  console.log(`Listening at http://localhost:${port}`);
});
