const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator/check');

let errors=[];

// Add routes for the "registration" page
router.get("/registration", (req, res) => {
    res.render("registration", {
        title: "registration"
    });
});

// router.post("/registration", (req, res) => {
//     // console.log(req.body);

//     const { firstName, lastName, email, password } = req.body;

//     let passedValidation = true;
//     let validationMessages = {};

//     //first name
//     if (typeof firstName !== "string" || firstName.trim().length == 0) {
//         passedValidation = false;
//         validationMessages.firstName = "You must specify a first name";
//     }
//     else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
//         passedValidation = false;
//         validationMessages.firstName = "The first name should be at least 2 characters long.";
//     }
//     else validationMessages.firstName = false;

//     //last name
//     if (typeof lastName !== "string" || lastName.trim().length == 0) {
//         passedValidation = false;
//         validationMessages.lastName = "You must specify a last name";
//     }
//     else if (typeof lastName !== "string" || lastName.trim().length <= 2) {
//         passedValidation = false;
//         validationMessages.lastName = "The last name should be at least 2 characters long.";
//     }
//     else 
//         validationMessages.lastName = false;

//     //email
//     var emailString = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,4}$/;
//     if (emailString.test(email)) {
//         validationMessages.email = false;
//     }
//     else {
//         validationMessages.email = "Please Enter a Valid Email";
//     }

//     //password
//     passwordString = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/;
//     if(passwordString.test(password)) {
//         validationMessages.password = false;
//     }
//     else {
//         passedValidation = false;
//         validationMessages.password = "password should be length 8-12 and at least with 1 UPPER CASE & 1 lower case & 1 Number & 1 Special Character";
//     }

//     if (passedValidation) {
//         //check if registered
//         userModel.findOne({
//             email: email
//         }) 
//         .then((user) => {
//             //if registered
//             if(user) {
//                 console.log("This email is already registered!");
//                 validationMessages.email = "This email is already registered!";
//                 res.render("registration", {
//                     title: "registration",
//                     values: req.body,
//                     validationMessages
//                 });
//             }
//             else {
//                 //if not yet registered
//                 const newUser = new userModel({
//                     email: req.body.email,
//                     lastName: req.body.lastName,
//                     firstName: req.body.firstName,
//                     password: req.body.password
//                 });

//                 //send email
//                 newUser.save()
//                 .then((userSaved) => {
//                     console.log(`User: ${userSaved.firstName} has been Saved`);

//                     const sgMail = require("@sendgrid/mail");
//                     sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//                     const msg = {
//                         to: email, //email
//                         from: "wso8@myseneca.ca",
//                         subject: "Welcome to David's Burger",
//                         html:
//                             `
//                             Dear ${firstName} ${lastName}, <br>
//                             <br>
//                             This is a welcome message send from David's Burger. <br>
//                             Welcome for your registration. <br>
//                             You have registered with: <br>
//                             <br>
//                             Email Address: ${email}<br>
//                             Password: ${password}<br>
//                             <br>
//                             Best Regards,<br>
//                             Wai Chung, So
//                             `
//                     };

//                     sgMail.send(msg)
//                         .then(
//                             res.redirect('/welcome')
//                         )
//                         .catch(err => {
//                             console.log("Error on sendgrid: " + err);

//                             res.render("registration", {
//                                 title: "registration",
//                                 values: req.body,
//                                 validationMessages
//                             });
//                         });
//                 })
//                 .catch((err) => {
//                     console.log(`Error: ${err} in saving the User: ${newUser.firstName}`)
//                     res.redirect("/");
//                 });
//             }
//         })
//         .catch((err) => {
//             errors.push("There was Error finding users in database... " + err);
//             console.log(errors[0]);

//             res.render("registration", {
//                 title: "registration",
//                 values: req.body,
//                 validationMessages,
//                 errors
//             });
//         })
//     }
//     else {
//         res.render("registration", {
//             title: "registration",
//             values: req.body,
//             validationMessages
//         });
//     }
// });




router.post("/registration", [
    check('firstName', 'You must specify a first name').notEmpty(),
    check('firstName', 'The first name should be at least 2 characters long.').isLength({ min: 2 }),
    check('lastName', 'You must specify a last name').notEmpty(),
    check('lastName', 'The last name should be at least 2 characters long.').isLength({ min: 2 }),
    check('email', 'Please Enter a Valid Email').isEmail(),
    check('password', 'password should be length 8-12 and at least with 1 UPPER CASE & 1 lower case & 1 Number & 1 Special Character').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/)
  ], (req, res) => {

    const errors = validationResult(req);
    const validationMessages = {};

    if (!errors.isEmpty()) {
        errors.array().forEach(function(error) {
            validationMessages[error.param] = error.msg;
        });

        return res.render("registration", {
            title: "registration",
            values: req.body,
            validationMessages
        });
    }

    const { firstName, lastName, email, password } = req.body;

    //check if registered
    userModel.findOne({
        email: email
    }) 
    .then((user) => {
        //if registered
        if(user) {
            console.log("This email is already registered!");
            validationMessages.email = "This email is already registered!";
            return res.render("registration", {
                title: "registration",
                values: req.body,
                validationMessages
            });
        }
        else {
                const newUser = new userModel({
                    email: req.body.email,
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    password: hash
                });

                //send email
                newUser.save()
                .then((userSaved) => {
                    console.log(`User: ${userSaved.firstName} has been registered`);

                    const sgMail = require("@sendgrid/mail");
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

                    const msg = {
                        to: email, //email
                        from: "wso8@myseneca.ca",
                        subject: "Welcome to David's Burger",
                        html:
                            `
                            Dear ${firstName} ${lastName}, <br>
                            <br>
                            This is a welcome message send from David's Burger. <br>
                            Welcome for your registration. <br>
                            You have registered with: <br>
                            <br>
                            Email Address: ${email}<br>
                            Password: ${password}<br>
                            <br>
                            Best Regards,<br>
                            Wai Chung, So\n                                `
                    };

                    sgMail.send(msg)
                        .then(
                            res.redirect('/welcome')
                        )
                        .catch(err => {
                            console.log("Error on sendgrid: " + err);

                            res.render("registration", {
                                title: "registration",
                                values: req.body,
                                validationMessages
                            });
                        });
                })
                .catch((err) => {
                    console.log(`Error: ${err} in saving the User: ${newUser.firstName}`)
                    res.redirect("/");
                });
                
            };
        }
    )
    .catch((err) => {
        errors.push("There was Error finding users in database... " + err);
        console.log(errors[0]);

        res.render("registration", {
            title: "registration",
            values: req.body,
            validationMessages,
            errors
        });
    })
});


module.exports = router;