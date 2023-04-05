const mealkitModel = require("../models/meal-kitModel");
const mealkitDB = require("../models/mealkit-db");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

let loadDataMsg="Success, data was uploaded!";

router.get("/meal-kits", async (req, res) => {

    // Protect this route, so only "data clerks" can access it.
    // Clerk signed in.
    // Load data here.
    // if (req.session && req.session.clerk) {

    //     mealsToAdd = mealkitDB.getAllMeals();

    //     mealkitModel.count({}, (err, count) => {
    //         if (err) {
    //             loadDataMsg = "Couldn't count the documents: " + err;
    //         }
    //         else if (count <8 ) {
    
    //             mealkitModel.insertMany(mealsToAdd, (err, docs) => {
    //                 if (err) {
    //                     loadDataMsg = "Couldn't insert the names, error: " + err;
    //                 }
    //                 else {
    //                     loadDataMsg = "Success, data was uploaded!";
    //                 }
    //             });
    //         }
    //         else {
    //             loadDataMsg = "There are already documents loaded.";
    //         }
    //     });

    // }

    if (req.session && req.session.clerk) {
        try {
          const mealsToAdd = mealkitDB.getAllMeals();
          const count = await mealkitModel.countDocuments({});
          if (count < 8) {
            await mealkitModel.insertMany(mealsToAdd);
            loadDataMsg = "Success, data was uploaded!";
          } else {
            loadDataMsg = "There are already documents loaded.";
          }
        } catch (err) {
          loadDataMsg = `Couldn't count the documents: ${err}`;
        }
    } else {
        // They are not signed in. They are not authorized.
        // Show an error message.
        loadDataMsg = "You are not authorized."  
    }
      res.render("loadDataOutCome", { loadDataMsg });
      console.log("loadDataMsg: " + loadDataMsg);
    });

module.exports = router;
