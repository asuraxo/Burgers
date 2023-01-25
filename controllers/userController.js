const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();

router.get("/cart", checkCustomer, (req, res) => {
    res.render("cart")
});
  
function checkCustomer(req, res, next) {
    if (!res.locals.user) {
        console.log("Not yet log-in as customer");
        res.redirect("/log-in");
    } 
    else {
        next();
    }
}
  
module.exports = router;