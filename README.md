# Kibandaski

This is a portfolio project I did as part of my full stack engineer course on [Codecademy](https://codecademy.com). It is an e-commerce app that allows the user to buy food from a Kenyan street restaurant (called a "kibanda" in Kiswahili; remixed to "kibandaski" by local youth), as well as perform functions on orders and products as an administrator. Users may view products without authorisation, but all other available functionality requires authorisation.

![A "kibandaski" in Kenya](https://global.discourse-cdn.com/codecademy/original/5X/e/8/f/1/e8f11e906dcfb4d83d09230efc9cad6a57b5d3dc.jpeg "")


## Server
### Requirements
- Build a functioning e-commerce REST API using Express, Node.js, and Postgres
- Allow users to register and log in via the API
- Allow CRUD operations on products
- Allow CRUD operations on user accounts
- Allow CRUD operations on user carts
- Allow a user to place an order
- Allow CRUD operations on orders
- Document the API using Swagger

### How it was built
#### Base libraries/techonolgies
- [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database system
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web application framework for Node.js

#### Additional libraries/techonolgies
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing library for Node.js
- [Cookie Parser](http://expressjs.com/en/resources/middleware/cookie-parser.html) - Express.js middleware for parsing cookies
- [CORS](https://github.com/expressjs/cors) - Express.js middleware for enabling CORS
- [Dotenv](https://github.com/motdotla/dotenv) - Module for loading environment variables from a .env file
- [express-session](https://expressjs.com/en/resources/middleware/session.html) - Express.js framework for managing session middleware 
- [Helmet.js](https://helmetjs.github.io/) - Node.js module for securing HTTP headers
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Node.js implementation of JSON web tokens
- [node-postgres](https://node-postgres.com/) - Node.js interface for PostgreSQL
- [request-ip](https://www.npmjs.com/package/request-ip) - Node.js module for retrieving a request's IP address
- [sanitize-html](https://www.npmjs.com/package/sanitize-html) - HTML sanitiser module
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - REST API documentation tool
  - [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express) - Express.js interface for Swagger UI  
- [Validator.js](https://github.com/validatorjs/validator.js) - Library of string validators and sanitisers


## Client
### Requirements
- Build a functioning e-commerce application using React, Node.js, and Postgres by extending your existing e-commerce REST API with an interactive client
- Use Git version control
- Use command line
- Develop locally on your computer
- Enable users to create a personal account
- Enable users to create an account with a third-party service (Google, Facebook, etc)
- Enable users to browse products
- Enable users to complete a purchase using a payment processor (Stripe recommended)
- Enable users to view order history
- Publish the application to Heroku

### How it was built
#### Base libraries/techonolgies
- [React](https://reactjs.org/) - JavaScript user interface library

#### Additional libraries/techonolgies
- [Jest](https://jestjs.io/) - JavaScript testing framework
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - React testing utility
- [Sass](https://github.com/sass/dart-sass) - CSS pre-processor
- [Validator.js](https://github.com/validatorjs/validator.js) - Library of string validators and sanitisers


## Features
Kibandaski is a multi-page app (MPA) with a basic design that is accessible from desktop, tablet and mobile devices with all modern browsers, with Lighthouse scores of 70 for performance, 97 for accessibility, 92 for best practices, and 100 for SEO (full report can be viewed by [clicking here](./readme/wpt-lighthouse.pdf), while a JSON of the app's [WebPageTest](https://www.webpagetest.org/) run can be viewed by [clicking here](./readme/wpt-result.json)).

The app's home page is the menu page, on which users may browse through all the products as rendered, or view products by category and sort them either in alphabetical order or by price (both ascending or descending).

![Menu page](./readme/screenshots/customer/screenshot-menu.png)
![Menu page showing carbohydrate products in descending alphabetical order](./readme/screenshots/customer/screenshot-menu-sorted.png)


### Authorisation
In order to successfully add items to their shopping cart and place orders, users must first register an account or log in if already registered. authorisation is available either through a standard email/password combination, or via open authorisation (OAuth) using Google or Facebook.

![Login page](./readme/screenshots/auth/screenshot-login.png)
![Registration page](./readme/screenshots/auth/screenshot-register.png)

There are two roles available to registered users on the app: **customer** and **admin**. All users are automatically assigned the customer role, whereas admin roles must be manually set from the database.


### Customer
Once logged in, customers are automatically redirected to their cart, which is initialised as empty. Users may view their account details and link their Google and/or Facebook accounts via the navigation below the header, or go back to view the menu by clicking the home icon in the header.

![Cart page](./readme/screenshots/customer/screenshot-cart-empty.png)
![Account page](./readme/screenshots/customer/screenshot-account.png)

#### Placing an order
Back in the menu page, users may notice that they now have access to the orders page, which displays all their orders and their status (more on that a bit later). Users are also now able to add items to their cart by clicking on the "Add to cart" button below the product description. Once added, the app will briefly replace the product's category text with a notification, before restoring the category text. Adding an item already in the cart will increment its quantity by one.

![Menu page showing item added to cart](./readme/screenshots/customer/screenshot-menu-added.png)

Once items are added to the cart, users are able to update their quantities (and see updated costs as a result), remove items from the cart, empty the cart or begin checkout. In the screenshot below, all the items initially added to the cart have had their quantities tripled.

![Cart page showing items in cart](./readme/screenshots/customer/screenshot-cart-added.png)

Users are able to make payments via [M-Pesa](https://www.safaricom.co.ke/personal/m-pesa), a mobile money transfer service available in Kenya. Upon confirming their phone number, the user will receive a prompt on their mobile phone to enter their M-Pesa PIN and complete the payment (though for the sake of demonstration, those steps are skipped and payment is confirmed on the app by default).

![Checkout page](./readme/screenshots/customer/screenshot-checkout.png)
![Checkout page showing order placed successfully](./readme/screenshots/customer/screenshot-checkout-complete.png)

#### Viewing orders
Once an order has been placed, the user is able to view its details in the orders page, including ID, time of placement and items, which are hidden by default.

![Orders page](./readme/screenshots/customer/screenshot-orders.png)
![Orders page showing items on a single order](./readme/screenshots/customer/screenshot-orders-items.png)

Users may also cancel an order if it is still pending. However, the option is no longer available once an order is acknowledged by an admin.

![Orders page showing an order has been acknowledged](./readme/screenshots/customer/screenshot-orders-acknowledged.png)

Similar to the menu page, users may also view their orders by status. The screenshot below shows orders that have been cancelled.

![Orders page showing cancelled orders](./readme/screenshots/customer/screenshot-orders-cancelled.png)


### Admin
In addition to all the functionality available to customers, admins are also able to view a list of all registered users, as well as perform administrative functions on orders and products. In the menu page, users may notice that the admin page is available to select in the navigation below the header, unlike for customers.

![Menu page showing admin option in navigation](./readme/screenshots/admin/screenshot-menu.png)

#### Orders
Admins may use the orders page to view a list of all orders, as well as acknowledge pending orders and fulfill acknowledged orders. Like with the customers' orders page, admins may view orders by status, as well as view orders by user ID (all or by status).

![Orders page](./readme/screenshots/admin/screenshot-orders.png)
![Orders page showing orders placed by user with ID 3532335](./readme/screenshots/admin/screenshot-orders-user.png)
![Orders page showing acknowledged orders (to be fulfilled)](./readme/screenshots/admin/screenshot-orders-acknowledged.png)

#### Products
The products page allows admins to view, update and delete existing products, as well as create new ones, with the same categorisation and sorting functionality as the customers' menu page.

![Products page](./readme/screenshots/admin/screenshot-products.png)
![Creating a new product](./readme/screenshots/admin/screenshot-products-create.png)
![Orders page showing newly-created product in its category](./readme/screenshots/admin/screenshot-products-added.png)

#### Users
As previously mentioned, admins are also able to view a list of all registered users. Just like with other list-based pages, admins may view a list of users by role.

![Users page](./readme/screenshots/admin/screenshot-users.png)
![Users page showing customers](./readme/screenshots/admin/screenshot-users-customer.png)


## Links
- Repository: [github.com/DavyK17/kibandaski](https://github.com/DavyK17/kibandaski)
- Live link: [kibandaski.up.railway.app](https://kibandaski.up.railway.app/)
  - API documentation [kibandaski.up.railway.app/api](https://kibandaski.up.railway.app/api)

### Use it yourself
- Customer credentials:
  - Email: **thisisan@email.com**
  - Password: **kibandaskiCustomer**
- Admin credentials:
  - Email: **thisisanother@email.com**
  - Password: **kibandaskiAdmin**

## Future work
The primary work remaining to be done on this project is writing server tests (which I continue to procrastinate on because I really struggle with mocking authentication to test protected routes).

Additional features could potentially be added in the future, such as:
- Adding more third-party login operations
- Adding more payment options

## Author
- GitHub: [@DavyK17](https://github.com/DavyK17)
- Website: [davyk17.github.io](https://davyk17.github.io)
