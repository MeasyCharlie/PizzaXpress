require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("express-flash");
const MongoDbStore = require("connect-mongo");
const passport = require("passport");
const { FALSE } = require("sass");
const Emitter = require("events");

// //database Connection
// const url = 'mongodb://localhost/PizzaExpress';
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection
  .once("open", () => {
    console.log("Database connected...");
  })
  .on("error", function (err) {
    console.log(err);
  });


const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

//session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoDbStore.create({
      client: connection.getClient(),
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

//passport config
require("./app/config/passport");

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//global middleware jisse ki session ki info layout.ejs tak ja sake
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
 
//set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

//(app) se function call ho rahi h jisse function chal jae web.js m
require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

//socket
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  //Join
  // console.log(socket.id);
  socket.on("join", (orderId) => {
    // console.log(orderId);
    socket.join(orderId);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});
