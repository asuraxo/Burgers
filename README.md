
****BURGERS ORDERING APP **

This is a Burger Ordering web application.
It allows logged-in users to browse a selection of meal kits, add them to their
shopping cart, and place an order. The application is built using Node.js,
Express, and MongoDB for the backend, and Express-Handlebars for the views.

**FEATURES: **

l   Users
can create an account (Sign-Up) and log in.

l   Users
can choose to log in as 'Customer' or 'Clerk'.

l   Customer:

n   Customer
can browse the menu and add burgers to their cart.

n   Customer
can place an order and view their order history.

n   Receipt
would be send to customer through Email.

l   Clerk:

n   Clerk
can add / edit / remove the burgers from the menu.

l   After
log out, session would be destroyed

**LIVE DEMO (CYCLIC): **

[https://grumpy-colt-sari.cyclic.app](https://grumpy-colt-sari.cyclic.app)

 **GITHUB LINK** :

[https://github.com/asuraxo/Burgers](https://github.com/asuraxo/Burgers)

**DEPENDENCIES: **

Dependencies
/ Library Used:

l   Express:

n   express-handlebars:
for the web-site view structure.

n   express-session:
for the log in session as customer or clerk.

n   express-fileupload:
for clerk to upload the photo of new meals.

l   MongoDB
/ Mongoose for the database hosting, modeling and querying.

l   bcrypt:
for the user's registration / log in

l   sendgrid:
to send the email receipt to the customer after ordering
