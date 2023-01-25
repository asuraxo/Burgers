const path = require("path");
const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();
const mealkitModel = require("../models/meal-kitModel");

var meals;

function checkClerk(req, res, next) {
    if (!res.locals.clerk) {
        console.log("Not yet log-in as clerk!");
        res.redirect("/log-in");
    } 
    else {
        next();
    }
}

router.get("/list-mealkits", checkClerk, (req, res) => {

    mealkitModel.find()
        .exec()
        .then(data => {
            //map value
            meals = data.map(value => value.toObject());
            res.render("list-mealkits", {
                meals,
            });
    });
});



module.exports = router;
