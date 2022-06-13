require("dotenv").config(); // enable reading from .env file
require("./models"); // enable app access database

// const express = require("express"),
//   app = express();

const app = require("express")();

//Middleware section------------
// app.use(express.json());
app.use(require("cookie-parser")());
app.use(require("body-parser").json({ limit: "50mb" }));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cors")({ credentials: true, origin: process.env.CLIENT }));

// const server = require("http").Server(app);

// app.use(require("cookie-parser")());
// app.use(require("cookie-session")({ secret, resave: true, saveUninitialized: true }));

app.use("/API/textTranslations/", require("./routes/textTranslations"));
app.use("/API/auth/", require("./routes/auth"));
// app.use("/admin/", routes.Admin);

// app.listen(PORT, () => {
//   console.log(`Listening to ${process.env.PORT}...`);
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`AtlasSearchTranslation:::listening on port ${PORT}`));
