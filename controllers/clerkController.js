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

router.post("/add-mealkit", checkClerk, (req, res) => {

    req.body.isTopMeal ? req.body.isTopMeal=true : req.body.isTopMeal=false;

    let newMeal = new mealkitModel({
        title       : req.body.title,
        includes    : req.body.includes,
        description : req.body.description,
        category    : req.body.category,
        price       : req.body.price,
        cookingTime : req.body.cookingTime,
        servings    : req.body.servings,
        topMeal     : req.body.isTopMeal
    });

    newMeal.save()
        .then(mealSaved => {
            console.log(`Meal: ${mealSaved.title} has been added to the database.`);

            // Create a unique name for the image, so that it can be stord in the file system.
            let uniqueName = `${mealSaved._id}${path.parse(req.files.mealPic.name).ext}`;

            // Copy the image data to a file in the "/assets/profile-pics" folder.
            req.files.mealPic.mv(`assets/images/Burgers/${uniqueName}`)
                .then(() => {
                    // Update the document so it includes the unique name.
                    mealkitModel.updateOne({
                        _id: mealSaved._id
                    }, {
                        imageUrl: uniqueName
                    })
                        .then(() => {
                            // Success
                            console.log("Updated the meal pic.");
                            res.redirect("/clerk/list-mealkits");
                        })
                        .catch(err => {
                            console.log(`Error updating the burger's image ... ${err}`);
                            res.redirect("/clerk/list-mealkits");
                        });
                })
                .catch(err => {
                    console.log(`Error saving the burger's picture ... ${err}`);
                    res.redirect("/clerk/list-mealkits");
                });
        })
        .catch(err => {
            console.log(`Error adding meal to the database ... ${err}`);
            res.redirect("/clerk/list-mealkits");
        });
});

router.post("/edit-mealkit/:id", checkClerk, (req, res) => {
    let editMealID = parseInt(req.params.id.replace(':',''));    
    mealkitModel.updateOne({
        id: editMealID
    }, {
        $set: {
            title       : req.body.title,
            includes    : req.body.includes,
            description : req.body.description,
            category    : req.body.category,
            price       : req.body.price,
            cookingTime : req.body.cookingTime,
            servings    : req.body.servings,
        }
    })
        .exec()
        .then(() => {
            console.log("Successfully updated the document for: " + req.body.id);

        });

    res.redirect("/clerk/list-mealkits");
});

router.get("/remove-mealkit/:id", checkClerk, (req, res) => {

    let deleteMealID = req.params.id.replace(':','');

    mealkitModel.findByIdAndRemove(deleteMealID, function(err, docs) {
        if(err) {
            console.log(err);
        }
        else{
            console.log("Removed meal: ", docs);
        }
    });
    res.redirect("/clerk/list-mealkits");
});

//load data controller
const loadDataController = require("../controllers/loadDataController");
router.use("/load-data/", loadDataController);
router.use('/load-data', express.static(path.join(__dirname, "../assets")));


module.exports = router;
