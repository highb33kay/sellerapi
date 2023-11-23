const express = require("express");
const { readdirSync } = require("fs");
require("dotenv/config");
const { errorHandler } = require("./middlewares/index");

const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger");
const authMiddleware = require("./middlewares/auth");

// Import the client from mongo.js
const { client } = require("./db/mongo");

// connect to the database
const {
  initializeDatabase,
  databaseMiddleware,
} = require("./middlewares/connectdb");

const app = express();
//  Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// initialize the database connection
initializeDatabase()
  .then(() => {
    // attach the database connection to routes
    app.use(databaseMiddleware);

    // Apply the authentication middleware to the entire app
    app.use(authMiddleware());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // serve all routes dynamically using readdirsync
    readdirSync("./src/routes").map((path) =>
      app.use("/api/v1", require(`./routes/${path}`))
    );

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });
    app.use(errorHandler);

    const port = process.env.PORT;

    // Start the server after initializing the database
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error initializing the database:", error);
  });

module.exports = app;
