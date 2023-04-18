const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const clientSessions = require("client-sessions");

const HTTP_PORT = process.env.PORT || 8080;


// Register handlerbars as the rendering engine for views
app.engine(".hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

// Setup the static folder that static resources can load from
// like images, css files, etc.
app.use(express.static("static"));

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));


// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }

  app.get("/",  (req, res) => {
    res.render("dashboard", {layout: false});
  });

  app.listen(HTTP_PORT, onHttpStart);
