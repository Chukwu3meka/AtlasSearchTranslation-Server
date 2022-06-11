require("dotenv").config(); // enable reading from .env file
require("./models"); // enable app access database

const PORT = process.env.PORT;
const secret = process.env.SECRET;

const app = require("express")();
app.use(require("cors")());

const server = require("http").Server(app);

app.use(require("cookie-parser")());
app.use(require("body-parser").json({ limit: "50mb" }));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-session")({ secret, resave: true, saveUninitialized: true }));

app.use("/API/textTranslations/", require("./routes/textTranslations"));
app.use("/API/auth/", require("./routes/auth"));
// app.use("/admin/", routes.Admin);

server.listen(PORT, () => console.log(`AtlasSearchTranslation:::listening on port ${PORT}`));
