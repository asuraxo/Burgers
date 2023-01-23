const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


let errors=[];

// Add your routes here
// e.g. app.get() { ... }

// Add routes for the "log-in" page
router.get("/log-in", (req, res) => {
    //gate double log-in
    if (res.locals.clerk || res.locals.user) {
        console.log("Logged In already, Move to main page now");
        res.redirect("/");
    } else {
        res.render("log-in", {
            title: "log-in"
        });
    }
});

router.post("/log-in", (req, res) => {

    console.log(req.body);
    const { email, password, logInAsClerk } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    const user = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    });

    //email gate
    if (typeof email !=="string" || email.trim().length == 0) {
        passedValidation = false;
        validationMessages.email = "Please Enter a Valid Email";
    }
    else validationMessages.email = false;
    
    //password gate
    if (typeof password !=="string" || password.trim().length == 0) {
        passedValidation = false;
        validationMessages.password = "Please Enter a Valid Password";
    }
    else validationMessages.password = false; 


    if (passedValidation) {
        userModel.findOne({
            email: req.body.email
        })
        .then ((user) => {
            if(user) {
                console.log("found user in database");
                bcrypt.compare(req.body.password, user.password)
                .then((isMatched) => {
                    if (isMatched) {
                        //create a new session and store the user object
                        if (logInAsClerk) {
                            console.log("It is a clerk!");
                            req.session.clerk = user;
                            res.redirect("/clerk/list-mealkits");
                        } else {
                            console.log("It is a user!");
                            req.session.user = user;
                            res.redirect("/customer/cart");
                        }

                    } else {
                        validationMessages.password = "Password not match!";
                        console.log(errors[0]);
                        res.render("log-in", {
                            title: "log-in",
                            values: req.body,
                            validationMessages
                        });   
                    }
                });
            }
            else {
                validationMessages.email = "User not found";
                console.log("user not found in database");
                res.render("log-in", {
                    title: "log-in",
                    values: req.body,
                    validationMessages
                });   
            }
        })
        .catch((err) => {
            errors.push("Error in finding users in database... " + err);
            console.log(errors[0]);
            res.render("log-in", {
                errors
            });
        })
    } else {
        console.log("Not passed validation");
        res.render("log-in", {
            title: "log-in",
            values: req.body,
            validationMessages
        });        
    }

});

module.exports = router;