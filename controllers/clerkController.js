const mealkitModel = require("../models/meal-kitModel");
const express = require("express");
const router = express.Router();

router.get("/list-mealkits", checkClerk, (req, res) => {
    res.render("list-mealkits")
});

function checkClerk(req, res, next) {
    if (!res.locals.clerk) {
        console.log("Not yet log-in as clerk!");
        res.redirect("/log-in");
    } 
    else {
        next();
    }
}

module.exports = router;
