// // Library
// const path = require("path");
// const express = require("express");
// const app = express();
// const exphbs = require("express-handlebars");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const session = require("express-session");
// const fileUpload = require("express-fileupload");
// const { homedir } = require("os");

// // Set up Handlebars.
// app.engine(".hbs", exphbs.engine({
//     extname: ".hbs",
//     defaultLayout: "main"
// }));
// app.set("view engine", ".hbs");
// app.use(express.static(path.join(__dirname, "/assets")));

// // Set up Body Parser.
// app.use(express.urlencoded({ extended: true }));

// // Set up express-upload
// app.use(fileUpload());

// // Set up dotenv.
// dotenv.config({ path: "./config/keys.env" });

// // Set up express-session
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true
// }));

// // Session
// app.use((req, res, next) => {
//     if (req.session.clerk) {
//         res.locals.clerk = req.session.clerk;
//     } else if (req.session.user){
//         res.locals.user = req.session.user;
//         res.locals.cart = req.session.cart;
//     }
//     next();
// });

// // Connect to the MongoDb
// mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     }).then(() => {
//         console.log("Connected to the MongoDB database.")
//     })
//     .catch(err => {
//         console.log(`There was a problem connecting to MongoDB ... ${err}`);
// });
// mongoose.set('strictQuery', true);


// // Set up controllers
//     //general controller
//     const generalController = require("./controllers/generalController");
//     app.use("/", generalController);

//     //registration controller
//     const registrationController = require("./controllers/registration");
//     app.use("/", registrationController);

//     //log in controller
//     const logInController = require("./controllers/log-in");
//     app.use("/", logInController);

//     //clerk controller
//     const clerkController = require("./controllers/clerkController");
//     app.use("/clerk/", clerkController);
//     app.use('/clerk', express.static(path.join(__dirname, "/assets")));

//     //user controller
//     const userController = require("./controllers/userController");
//     app.use("/customer/", userController);
//     app.use('/customer', express.static(path.join(__dirname, "/assets")));

// // *** DO NOT MODIFY THE LINES BELOW ***

//     //404
//     app.use((req, res) => {
//         res.status(404).send("Page Not Found");
//     });

//     //500
//     app.use(function (err, req, res, next) {
//         console.error(err.stack)
//         res.status(500).send("Something broke!")
//     });

// // Define a port to listen to requests on.
// const HTTP_PORT = process.env.PORT || 8080;

// // Call this function after the http server starts listening for requests.
// function onHttpStart() {
//     console.log("Express http server listening on: " + HTTP_PORT);
// }
// app.listen(HTTP_PORT, onHttpStart);


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 8080;

// Set up Handlebars.
app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/assets')));

// Set up Body Parser.
app.use(express.urlencoded({ extended: true }));

// Set up express-upload
app.use(fileUpload());

// Set up dotenv.
dotenv.config({ path: './config/keys.env' });

// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Session
app.use((req, res, next) => {
    if (req.session.clerk) {
        res.locals.clerk = req.session.clerk;
    } else if (req.session.user) {
        res.locals.user = req.session.user;
        res.locals.cart = req.session.cart;
    }
    next();
});

// Connect to the MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Connected to the MongoDB database: ${conn.connection.host}`);
    } catch (error) {
        console.log(`There was a problem connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};

// Routes
app.use('/', require('./controllers/generalController'));
app.use('/', require('./controllers/registration'));
app.use('/', require('./controllers/log-in'));
app.use('/clerk/', require('./controllers/clerkController'));
app.use('/clerk', express.static(path.join(__dirname, '/assets')));
app.use('/customer/', require('./controllers/userController'));
app.use('/customer', express.static(path.join(__dirname, '/assets')));

// 404
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// 500
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Express http server listening on: ${PORT}`);
    });
});
