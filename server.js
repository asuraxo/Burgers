/*************************************************************************************
* WEB322 - 2227 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Wai Chung, So
* Student ID    : 147446215
* Course/Section: WEB322/NEE
*
**************************************************************************************/

const path = require("path");
const exphbs = require("express-handlebars");
const express = require("express");
const { homedir } = require("os");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./config/keys.env" });

app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));

app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/assets")));


const burgerList = require("./models/mealkit-db");
const renderPages = require("./models/Pages");
const pages=renderPages.getPages();

// Add your routes here
// e.g. app.get() { ... }
app.get("/", (req, res) => {
    res.render("home", {
        burgers: burgerList.getTopMealkits()
    });
});

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });



app.get("/headers", (req, res) => {
    const headers = req.headers;
    res.json(headers);
})

app.get("/on-the-menu", (req, res) => {
    res.render("on-the-menu", {
        burgers: burgerList.getMealsByCategory()
    });
});

app.get("/welcome", (req, res) => {
    res.render("welcome")
});

const registrationController = require("./controllers/registration");
app.use("/", registrationController);

const logInController = require("./controllers/log-in");
app.use("/", logInController);


pages.forEach((element) => {
    app.get((element.site), (req, res) => {
        res.render(element.name);
    });
});

// pages.forEach((element) => {
//     if(element.loadItem===0) {
//         app.get((element.site), (req, res) => {
//             res.render(element.name);
//         });
//     }
//     else {
//         app.get((element.site), (req, res) => {
//             res.render(element.name, {
//                 element.loadItem.name: element.loadItem.function;
//             });
//         });
//     }
// });





// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);




// var HTTP_PORT = process.env.PORT || 8080;
// var express = require("express");
// var app = express();

// // setup a 'route' to listen on the default url path
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

// // setup http server to listen on HTTP_PORT
// app.listen(HTTP_PORT);