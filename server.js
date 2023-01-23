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
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const session = require("express-session");
const fileUpload = require("express-fileupload");
const { homedir } = require("os");


// Set up Handlebars.
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");
app.use(express.static(path.join(__dirname, "/assets")));

// Set up Body Parser.
app.use(express.urlencoded({ extended: true }));

// Set up express-upload
app.use(fileUpload());

// Set up dotenv.
dotenv.config({ path: "./config/keys.env" });

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use((req, res, next) => {
    // res.locals.user is a global handlebars variable.
    // This means that every single handlebars file can access this variable.
    if (req.session.clerk) {
        res.locals.clerk = req.session.clerk;
    } else if (req.session.user){
        res.locals.user = req.session.user;
        res.locals.cart = req.session.cart;
    }
    
    next();
});

// Connect to the MongoDb
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to the MongoDB database.")
    })
    .catch(err => {
        console.log(`There was a problem connecting to MongoDB ... ${err}`);
});
mongoose.set('strictQuery', true);


// Set up controllers
const generalController = require("./controllers/generalController");

app.use("/", generalController);

const registrationController = require("./controllers/registration");
app.use("/", registrationController);

const logInController = require("./controllers/log-in");
app.use("/", logInController);

const clerkController = require("./controllers/clerkController");
// app.use("/", clerkController);
app.use("/clerk/", clerkController);
app.use('/clerk', express.static(path.join(__dirname, "/assets")));

const userController = require("./controllers/userController");
// app.use("/", userController);
app.use("/customer/", userController);
app.use('/customer', express.static(path.join(__dirname, "/assets")));


// Add your routes here
// e.g. app.get() { ... }



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
