const express = require("express");
const router = express.Router();


const burgerList = require("../models/mealkit-db");

const renderPages = require("../models/Pages");
const pages=renderPages.getPages();

// Route to the default home page
router.get("/", (req, res) => {
    res.render("home", {
        burgers: burgerList.getTopMealkits()
    });
});

// Route to the headers
router.get("/headers", (req, res) => {
    const headers = req.headers;
    res.json(headers);
})

// Route to on-the-menu
router.get("/on-the-menu", (req, res) => {
    res.render("on-the-menu", {
        burgers: burgerList.getMealsByCategory()
    });
});

// Route to welcome
router.get("/welcome", (req, res) => {
    res.render("welcome")
});

// Route to rest
pages.forEach((element) => {
    router.get((element.site), (req, res) => {
        res.render(element.name);
    });
});

router.get("/log-out", (req, res) => {
    req.session.destroy();
    res.redirect("/log-in");
});

module.exports = router;