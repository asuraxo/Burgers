const express = require("express");
const router = express.Router();

// Add your routes here
// e.g. app.get() { ... }

// Add routes for the "registration" page
router.get("/registration", (req, res) => {
    res.render("registration", {
        title: "registration"
    });
});

router.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "log-in"
    });
});

router.post("/registration", (req, res) => {
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

    //first name
    if (typeof firstName !== "string" || firstName.trim().length == 0) {
        passedValidation = false;
        validationMessages.firstName = "You must specify a first name";
    }
    else if (typeof firstName !== "string" || firstName.trim().length <= 2) {
        passedValidation = false;
        validationMessages.firstName = "The first name should be at least 2 characters long.";
    }
    else validationMessages.firstName = false;

    //last name
    if (typeof lastName !== "string" || lastName.trim().length == 0) {
        passedValidation = false;
        validationMessages.lastName = "You must specify a last name";
    }
    else if (typeof lastName !== "string" || lastName.trim().length <= 2) {
        passedValidation = false;
        validationMessages.lastName = "The last name should be at least 2 characters long.";
    }
    else validationMessages.lastName = false;

    //email
    var emailValid1 = true, emailValid2=true;

    var position1=email.search('@');
    if (position1 === -1 || position1 === 0 || position1 === email.length-1) {
        emailValid1 = false;
        passedValidation = false;
    }

    var position2=-1;
    for(let i=0; i<email.length; i++) {
        if (email[i]==='.')
            position2=i;
    }
    if (position2 === -1 || position2 === 0 || position2 === email.length-1) {
        emailValid2 = false;
        passedValidation = false;
    }

    if (emailValid1 === true && emailValid2 === true) {
        validationMessages.email = false;
    }
    else {
        validationMessages.email = "Please Enter a Valid Email";
    }

    //password

    let hasLowerCase = false;
    let hasUpperCase = false;
    let hasNumbers   = false;
    let hasSpecial   = false;
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    for (var i=0; i<password.length; i++){
        if (password[i]==password[i].toLowerCase() && password[i].match(/[a-z]/i)){
          hasLowerCase = true;
        }
        else if (password[i]==password[i].toUpperCase() && password[i].match(/[A-Z]/i)){
            hasUpperCase = true;
        }
        else if (!isNaN(password[i])) {
            hasNumbers = true;
        }
    }

    hasSpecial = specialChars.test(password);


    if (hasLowerCase === false || hasUpperCase === false || hasNumbers === false || hasSpecial ===false || password.trim().length < 8 || password.trim().length > 12) {

        passedValidation = false;

        validationMessages.password = "password should be length 8-12 and at least with 1 UPPER CASE & 1 lower case & 1 Number & 1 Special Character";
    }
    else validationMessages.password = false;

    if (passedValidation) {

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
                Wai Chung, So
                `
        };

        customer={firstName, lastName, email, password};

        sgMail.send(msg)
            .then(
                res.redirect('/welcome')
            )
            .catch(err => {
                console.log(err);

                res.render("registration", {
                    title: "registration",
                    values: req.body,
                    validationMessages
                });
            });
    }
    else {
        res.render("registration", {
            title: "registration",
            values: req.body,
            validationMessages
        });
    }

});

module.exports = router;