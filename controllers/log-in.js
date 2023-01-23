const express = require("express");
const router = express.Router();

// Add your routes here
// e.g. app.get() { ... }

// Add routes for the "registration" page
router.get("/log-in", (req, res) => {
    res.render("log-in", {
        title: "log-in"
    });
});

router.post("/log-in", (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    let passedValidation = true;
    let validationMessages = {};

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
        res.redirect('/welcome')
    }
    else {
        res.render("log-in", {
            title: "log-in",
            values: req.body,
            validationMessages
        });
    }
});

module.exports = router;