const path = require("path");
const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const mealkitModel = require("../models/meal-kitModel");

router.use('/particularMealKit', express.static(path.join(__dirname, "../assets")));


// Find a meal from the faux database.
const findMeal = function (id) {
    return meals.find(meal => {
        return meal.id == id;
    });
}

function checkCustomer(req, res, next) {
    if (!res.locals.user) {
        // console.log("Not yet log-in as customer");
        res.redirect("/log-in");
    } 
    else {
        next();
    }
}


const prepareViewModel = function (req, message) {

    if (req.session && req.session.user) {

        let cart = req.session.cart || [];
        let cartTotal = 0;
        const hasMeals = cart.length > 0;

        if (hasMeals) {
            cart.forEach(cartMeal => {
                cartMeal.subTotal=cartMeal.qty*cartMeal.meal.price;
                cartTotal += cartMeal.meal.price * cartMeal.qty;
            });
        }

        return {
            message,
            hasMeals,
            cart: cart,
            cartTotal: "$" + cartTotal.toFixed(2),
        };
    }
    else {
        return {
            message,
            hasMeals: false,
            cart: [],
            cartTotal: "$0.00"
        };
    }
}

router.get("/particularMealKit/:id", checkCustomer, (req, res) => {

    let particularMealID = req.params.id.replace(':','');
    mealkitModel.findById(particularMealID)
        .exec()
        .then(data => {
            res.render("particularMealKit", {
                id:data.id,
                imageUrl: data.imageUrl,
                title : data.title,
                description : data.description,
                price: data.price,
                includes: data.includes,
                cookingTime: data.cookingTime,
                servings: data.servings
            });
    });
});

router.get("/cart", checkCustomer, (req, res) => {
    res.render("cart", prepareViewModel(req));
});

// Route to add a new meal to the shopping cart.
// The ID of the meal will be specified as part of the URL.
router.get("/add-meal/:id", (req, res) => {

    const mealId = req.params.id.replace(':','');

    let message;
    let meal ;
    let cart = (req.session.cart = req.session.cart || []);

    mealkitModel.find({ _id : mealId })
    .exec()
    .then(data => {
        meal=data[0];
        let found = false;
        cart.forEach(cartMeal => {
            if (cartMeal.id == mealId) {
                found = true;
                cartMeal.qty++;
            }
        });

        if (found) {
            message = "The meal was already in the cart, incremented the quantity by one.";
            console.log(message);
            res.redirect("/customer/cart");
        }
        else {

            cart.push({
                id: mealId,
                qty: 1,
                meal,
                subTotal:meal.price
            });

            message = "The meal was added to the shopping cart.";
            console.log(message);

            res.redirect("/customer/cart");
        }
    })
});


router.get("/remove-meal/:id", checkCustomer, (req, res) => {

    const mealId = req.params.id.replace(':','');

        let cart = req.session.cart || [];

        const index = cart.findIndex(cartMeal => cartMeal.id == mealId);

        if (index >= 0) {
            message = `Removed "${cart[index].meal.name}" from the cart.`;
            cart.splice(index, 1);
        }
        else {
            message = "Meal was not found in the cart.";
        }
    
    res.redirect("/customer/cart");
});
  
router.get("/check-out", checkCustomer, (req, res) => {
    let cart = req.session.cart || [];
    let receipt = prepareViewModel(req);

    let receiptMsg;

    if (cart.length > 0) {
        cart.forEach((cartItem) => {
            receiptMsg += ` ${cartItem.qty} orders of : ${cartItem.meal.title},<br>`;
        });
    }

    if (cart.length > 0) {
  
      let message = "Thank you for your purchase. Please Check email for you receipt.";
  
      let user = req.session.user;

      const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
      const msg = {
        to: user.email, //email
        from: "wso8@myseneca.ca",
        subject: "Order Receipt",
        text: "Order",
        html: `
            Dear ${user.firstName} ${user.lastName}, <br>
            Thank you for your purchase. You ordered:<br>
            ${receiptMsg}<br>
            total is ${receipt.cartTotal}<br>
            `,
      };
  
      sgMail
        .send(msg)
        .then()
        .catch((err) => {
          console.log(err);
        });
      req.session.cart = [];
      res.render("cart", {
        message
      });
    } else {
      // There are no items in the cart.
      // redirect to cart page, because if no items in cart, button wont show up
      console.log("invalid access");
      res.redirect("/customer/cart");
    }
});








module.exports = router;