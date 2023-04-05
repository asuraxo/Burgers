// const path = require("path");
const express = require("express");
// const router = express.Router();
// const userModel = require("../models/userModel");
// const mealkitModel = require("../models/meal-kitModel");

// router.use('/particularMealKit', express.static(path.join(__dirname, "../assets")));

// // Gate for customer
// function checkCustomer(req, res, next) {
//     if (!res.locals.user) {
//         // console.log("Not yet log-in as customer");
//         res.redirect("/log-in");
//     } 
//     else {
//         next();
//     }
// }

// // Find a meal from the faux database.
// const findMeal = function (id) {
//     return meals.find(meal => {
//         return meal.id == id;
//     });
// }

// // process purchase cart
// const prepareViewModel = function (req, message) {
//     if (req.session && req.session.user) {
//         let cart = req.session.cart || [];
//         let cartTotal = 0;
//         const hasMeals = cart.length > 0;
//         if (hasMeals) {
//             cart.forEach(cartMeal => {
//                 cartMeal.subTotal=cartMeal.qty*cartMeal.meal.price;
//                 cartTotal += cartMeal.meal.price * cartMeal.qty;
//             });
//         }

//         return {
//             message,
//             hasMeals,
//             cart: cart,
//             cartTotal: "$" + cartTotal.toFixed(2),
//         };
//     }
//     else {
//         return {
//             message,
//             hasMeals: false,
//             cart: [],
//             cartTotal: "$0.00"
//         };
//     }
// }

// // mealkit page
// router.get("/particularMealKit/:id", checkCustomer, (req, res) => {
//     let particularMealID = req.params.id.replace(':','');
//     mealkitModel.findById(particularMealID)
//         .exec()
//         .then(data => {
//             res.render("particularMealKit", {
//                 id:data.id,
//                 imageUrl: data.imageUrl,
//                 title : data.title,
//                 description : data.description,
//                 price: data.price,
//                 includes: data.includes,
//                 cookingTime: data.cookingTime,
//                 servings: data.servings
//             });
//     });
// });

// // render cart view
// router.get("/cart", checkCustomer, (req, res) => {
//     res.render("cart", prepareViewModel(req));
// });

// // customer add meal to the cart
// router.get("/add-meal/:id", (req, res) => {
//     const mealId = req.params.id.replace(':','');
//     let message;
//     let meal ;
//     let cart = (req.session.cart = req.session.cart || []);

//     mealkitModel.find({ _id : mealId })
//     .exec()
//     .then(data => {
//         meal=data[0];
//         let found = false;
//         cart.forEach(cartMeal => {
//             if (cartMeal.id == mealId) {
//                 found = true;
//                 cartMeal.qty++;
//             }
//         });

//         // if it is in cart already
//         if (found) {
//             message = "The meal was already in the cart, incremented the quantity by one.";
//             console.log(message);
//             res.redirect("/customer/cart");
//         }
//         // push the meal to cart
//         else {
//             cart.push({
//                 id: mealId,
//                 qty: 1,
//                 meal,
//                 subTotal:meal.price
//             });
//             message = "The meal was added to the shopping cart.";
//             console.log(message);
//             res.redirect("/customer/cart");
//         }
//     })
// });

// // remove meal kit from the pruchase cart
// router.get("/remove-meal/:id", checkCustomer, (req, res) => {
//     const mealId = req.params.id.replace(':','');
//         let cart = req.session.cart || [];
//         const index = cart.findIndex(cartMeal => cartMeal.id == mealId);
//         if (index >= 0) {
//             message = `Removed "${cart[index].meal.name}" from the cart.`;
//             cart.splice(index, 1);
//         }
//         else {
//             message = "Meal was not found in the cart.";
//         }
//     res.redirect("/customer/cart");
// });
  
// // check-out for the purchase cart
// router.get("/check-out", checkCustomer, (req, res) => {
//     let cart = req.session.cart || [];
//     let receipt = prepareViewModel(req);

//     let receiptMsg;

//     if (cart.length > 0) {
//         cart.forEach((cartItem) => {
//             receiptMsg += ` ${cartItem.qty} orders of : ${cartItem.meal.title},<br>`;
//         });
//     }

//     // send email receipt through sendgrid
//     if (cart.length > 0) {
//       let message = "Thank you for your purchase. Please Check email for you receipt.";
//       let user = req.session.user;
//       const sgMail = require("@sendgrid/mail");
//       sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
//       const msg = {
//         to: user.email,
//         from: "wso8@myseneca.ca",
//         subject: "Order Receipt",
//         text: "Order",
//         html: `
//             Dear ${user.firstName} ${user.lastName}, <br>
//             Thank you for your purchase. You ordered:<br>
//             ${receiptMsg}<br>
//             total is ${receipt.cartTotal}<br>
//             `,
//       };
  
//       sgMail
//         .send(msg)
//         .then()
//         .catch((err) => {
//           console.log(err);
//         });
//       req.session.cart = [];
//       res.render("cart", {
//         message
//       });
//     } else {
//       console.log("invalid access");
//       res.redirect("/customer/cart");
//     }
// });

// module.exports = router;



const router = express.Router();
const userModel = require('../models/userModel');
const mealkitModel = require('../models/meal-kitModel');
const path = require('path');

router.use('/particularMealKit', express.static(path.join(__dirname, '../assets')));

// Middleware function to check if the user is a customer
function checkCustomer(req, res, next) {
  if (!res.locals.user) {
    res.redirect('/log-in');
  } else {
    next();
  }
}

// Function to find a meal from the faux database
const findMeal = (id, meals) => meals.find(meal => meal.id === id);

// Function to prepare the view model for the cart
const prepareViewModel = req => {
  if (req.session && req.session.user) {
    const { cart = [] } = req.session;
    let cartTotal = 0;
    const hasMeals = cart.length > 0;
    if (hasMeals) {
      cart.forEach(cartMeal => {
        cartMeal.subTotal = cartMeal.qty * cartMeal.meal.price;
        cartTotal += cartMeal.meal.price * cartMeal.qty;
      });
    }

    return {
      message: '',
      hasMeals,
      cart,
      cartTotal: `$${cartTotal.toFixed(2)}`,
    };
  } else {
    return {
      message: '',
      hasMeals: false,
      cart: [],
      cartTotal: '$0.00',
    };
  }
};

// Handler function for the mealkit page
const handleMealKitPage = async (req, res) => {
  const { id: particularMealID } = req.params;
  try {
    const data = await mealkitModel.findById(particularMealID).exec();
    const {
      id,
      imageUrl,
      title,
      description,
      price,
      includes,
      cookingTime,
      servings,
    } = data;
    res.render('particularMealKit', {
      id,
      imageUrl,
      title,
      description,
      price,
      includes,
      cookingTime,
      servings,
    });
  } catch (error) {
    res.send(error);
  }
};

// Handler function for the cart view
const handleCartView = (req, res) => {
  const viewData = prepareViewModel(req);
  res.render('cart', viewData);
};

// Handler function for adding a meal to the cart
const handleAddMeal = async (req, res) => {
  const { id: mealId } = req.params;
  let message;

  try {
    const data = await mealkitModel.find({ _id: mealId }).exec();
    const meal = data[0];

    const foundIndex = req.session.cart.findIndex(
      cartMeal => cartMeal.id === mealId
    );

    // If the meal is already in the cart, increment its quantity by 1
    if (foundIndex !== -1) {
      req.session.cart[foundIndex].qty += 1;
      message = 'The meal was already in the cart. Incremented the quantity by 1';
    } else {
      req.session.cart.push({
        id: mealId,
        qty: 1,
        meal,
        subTotal: meal.price,
      });
      message = 'The meal was added to the shopping cart.';
    }

    res.redirect('/customer/cart');
  } catch (error) {
        res.send(error);
  }
};

// Handler function for removing a meal from the cart
const handleRemoveMeal = (req, res) => {
  const { id: mealId } = req.params;
  const { cart = [] } = req.session;
  const foundIndex = cart.findIndex(cartMeal => cartMeal.id === mealId);

  let message;

  if (foundIndex !== -1) {
    message = `Removed "${cart[foundIndex].meal.name}" from the cart.`;
    cart.splice(foundIndex, 1);
  } else {
    message = 'Meal was not found in the cart.';
  }

  res.redirect('/customer/cart');
};

// Handler function for checking out
const handleCheckOut = async (req, res) => {
  const { cart = [] } = req.session;
  const { user } = req.session;
  const receipt = prepareViewModel(req);
  let receiptMsg = '';

  if (cart.length) {
    cart.forEach(cartItem => {
      receiptMsg += `${cartItem.qty} orders of: ${cartItem.meal.title},<br>`;
    });
  }

  try {
    // Send email receipt through SendGrid
    if (cart.length) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: 'wso8@myseneca.ca',
        subject: 'Order Receipt',
        text: 'Order',
        html: `
          Dear ${user.firstName} ${user.lastName},<br>
          Thank you for your purchase. You ordered:<br>
          ${receiptMsg}<br>
          Total is ${receipt.cartTotal}<br>
        `,
      };

      await sgMail.send(msg);
      req.session.cart = [];
      res.render('cart', { message: 'Thank you for your purchase! Please check your email for your receipt.' });
    } else {
      res.redirect('/customer/cart');
    }
  } catch (error) {
    console.log(error);
  }
};

router.get('/particularMealKit/:id', checkCustomer, handleMealKitPage);
router.get('/cart', checkCustomer, handleCartView);
router.get('/add-meal/:id', handleAddMeal);
router.get('/remove-meal/:id', checkCustomer, handleRemoveMeal);
router.get('/check-out', checkCustomer, handleCheckOut);
module.exports = router;
