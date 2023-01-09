# Kibandaski

This is a portfolio project I did as part of my full stack engineer course on [Codecademy](https://codecademy.com). It is a Node.js REST API that allows the user to buy food from a local street restaurant (called a "kibanda" in Kiswahili; remixed to "kibandaski" by local youth in recent years).

![A "kibandaski" in Kenya](https://global.discourse-cdn.com/codecademy/original/5X/e/8/f/1/e8f11e906dcfb4d83d09230efc9cad6a57b5d3dc.jpeg "")

## The project
### Requirements
- Build a functioning e-commerce REST API using Express, Node.js, and Postgres
- Allow users to register and log in via the API
- Allow CRUD operations on products
- Allow CRUD operations on user accounts
- Allow CRUD operations on user carts
- Allow a user to place an order
- Allow CRUD operations on orders
- Document the API using Swagger

### Links
- Repository: [github.com/DavyK17/kibandaski-server](https://github.com/DavyK17/kibandaski-server)
- Live link: [kibandaski-server.up.railway.app](https://kibandaski-server.up.railway.app/)

## How it was built
### Base libraries/techonolgies
- [PostgreSQL](https://www.postgresql.org/) - Open source object-relational database system
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web application framework for Node.js

### Additional libraries/techonolgies
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

## Future work
None planned at the moment, but additional features could potentially be added in the future such as:
- Adding more third-party login operations
- Adding more payment options

## Author
- GitHub: [@DavyK17](https://github.com/DavyK17)
- Website: [davyk17.github.io](https://davyk17.github.io)
