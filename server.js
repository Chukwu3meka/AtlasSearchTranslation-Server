require("dotenv").config(); // enable reading from .env file
require("./models"); // enable app access database

// const express = require("express"),
//   app = express();

const app = require("express")();

//Middleware section------------

const port = process.env.PORT;

app.use(
  require("cors")({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://atlassearchtranslation.com"],
    credentials: true, //access-control-allow-credentials:true

    // methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    // optionSuccessStatus: 200,
    // allowedHeaders: true,
  })
);
app.use(require("express").json());
app.use(require("cookie-parser")());

app.use(require("body-parser").json({ limit: "50mb" }));
app.use(require("body-parser").urlencoded({ extended: true }));

// app.use((req, res, next) => {

//   Access-Control-Allow-Credentials: true
// Access-Control-Allow-Headers: x-requested-with,content-type
// Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE
// Access-Control-Allow-Origin: http://127.0.0.1:1288
// Access-Control-Max-Age: 3600

//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Headers", "Set-Cookie");
//   // res.header("Set-Cookie", "HttpOnly;Secure;SameSite=None");
//   res.header("Set-Cookie", "HttpOnly;SameSite=None");
//   // res.header(
//   //   "Access-Control-Allow-Headers",
//   //   "Origin, X-Requested-With, Content-Type, Accept"
//   // );
//   res.header("Access-Control-Allow-Origin", process.env.CLIENT);

//   res.set("credentials", "include");
//   res.set("Access-Control-Allow-Credentials", true);
//   res.set("Access-Control-Allow-Origin", req.headers.origin);
//   res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
// res.set("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

//   next();
// });

// const server = require("http").Server(app);

// app.use(require("cookie-parser")());
// app.use(require("cookie-session")({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));

app.use("/API/textTranslations/", require("./routes/textTranslations"));
app.use("/API/auth/", require("./routes/auth"));
app.use("/API/admin/", require("./routes/admin"));

// app.listen(port, () => {
//   console.log(`Listening to ${process.env.PORT}...`);
// });

app.listen(port, () => console.log(`AtlasSearchTranslation:::listening on port ${port}`));
