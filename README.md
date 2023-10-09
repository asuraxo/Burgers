
**BURGERS ORDERING APP **

This is a Burger Ordering web application.
It allows logged-in users to browse a selection of meal kits, add them to their
shopping cart, and place an order. The application is built using Node.js,
Express, and MongoDB for the backend, and Express-Handlebars for the views.

**FEATURES: **

Users can create an account (Sign-Up) and log in.

Users can choose to log in as 'Customer' or 'Clerk'.

Customer:

   Customer can browse the menu and add burgers to their cart.

   Customer can place an order and view their order history.

   Receipt would be send to customer through Email.

Clerk:

   Clerk can add / edit / remove the burgers from the menu.

After log out, session would be destroyed

**LIVE DEMO (CYCLIC): **

[https://grumpy-colt-sari.cyclic.app](https://grumpy-colt-sari.cyclic.app)

 **GITHUB LINK** :

[https://github.com/asuraxo/Burgers](https://github.com/asuraxo/Burgers)

**DEPENDENCIES: **

Dependencies
Library Used:

Express:

   express-handlebars: for the web-site view structure.

   express-session: for the log in session as customer or clerk.

   express-fileupload: for clerk to upload the photo of new meals.

   MongoDB
	Mongoose for the database hosting, modeling and querying.

   bcrypt:
	for the user's registration / log in

   sendgrid:
	to send the email receipt to the customer after ordering
