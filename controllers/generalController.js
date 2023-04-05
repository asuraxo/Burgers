const express = require("express");
const router = express.Router();
const MealKit = require("../models/mealkit-db");
const mealKitModel = require("../models/meal-kitModel");
const renderPages = require("../models/Pages");
const pages=renderPages.getPages();


// Route to the default home page
router.get("/", async (req, res) => {
    const burgers = await MealKit.getTopMealKits();
    res.render('home', { burgers });
});

// Route to the headers
router.get("/headers", (req, res) => {
    const headers = req.headers;
    res.json(headers);
})

// Route to on-the-menu
// router.get("/on-the-menu", (req, res) => {

//     mealKitModel.find()
//     .exec()
//     .then(data => {
//         meals = data.map(value => value.toObject());

//         var mealsByCategory = [];
//         var addCategory = true;

//         //add new categories
//         for(let i=0; i<meals.length; i++) {
//             for(let j=0; j<mealsByCategory.length; j++) {
//                 if(meals[i].category===mealsByCategory[j].categoryName){
//                     addCategory=false;
//                 };
//             }
//             if(addCategory) {
//                 mealsByCategory.push(
//                     {
//                         categoryName:meals[i].category, 
//                         mealKits:[]
//                     }
//                 );
//                 mealsByCategory[mealsByCategory.length-1].categoryName = meals[i].category;            
//             }
//             addCategory = true;
//         }
//         //push into category
//         for(let i=0; i<meals.length; i++) {
//             for(let j=0; j<mealsByCategory.length; j++) {
//                 if(meals[i].category===mealsByCategory[j].categoryName){
//                     mealsByCategory[j].mealKits.push(meals[i]);
//                 }
//             }
//         }

//         res.render("on-the-menu", {
//             burgers: mealsByCategory,
//         });
//     });
// });

router.get('/on-the-menu', async (req, res) => {
    const meals = await mealKitModel.find().lean();
  
    const mealsByCategory = meals.reduce((accumulator, currentValue) => { 
      let categoryFound = false;
  
      accumulator.forEach((category) => {
        if (category.categoryName === currentValue.category) {
          category.mealKits.push(currentValue);
          categoryFound = true;
        }
      });
  
      if (!categoryFound)
        accumulator.push({
          categoryName: currentValue.category,
          mealKits: [currentValue],
        });
  
      return accumulator;
    }, []);
  
    res.render('on-the-menu', {
      burgers: mealsByCategory,
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