const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const path = require("path");
const { auth } = require("express-openid-connect");

const router = require(path.join(__dirname, "./routes/index.js"));
const tokens_router = require(path.join(__dirname, "./routes/tokens.js"));
const replikas_router = require(path.join(__dirname, "./routes/replikas.js"));
const avatar_router = require(path.join(__dirname, "./routes/avatar.js"));
const settings_router = require(path.join(__dirname, "./routes/settings.js"));

const app = express();

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "./utils")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: "http://localhost:3000",
    secret: process.env.AUTH_SECRET,
    clientID: process.env.AUTH_CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
};

app.use(auth(config));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    next();
})

app.use("/", router);
app.use("/tokens", tokens_router);
app.use("/replikas", replikas_router);
app.use("/avatar", avatar_router);
app.use("/settings", settings_router);

app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: process.env.NODE_ENV !== "production" ? err : {},
    });
});

http.createServer(app).listen(3000, () => {
    console.log(`Listening on ${config.baseURL}`);
});
