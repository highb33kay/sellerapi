// connectDB.js
const { client } = require("../db/mongo");

let dbInstance; // A variable to store the database connection instance

async function initializeDatabase() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("olist").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    dbInstance = client.db("olist"); // Set dbInstance to the connected database
    console.log("Database connection initialized");
  } catch (error) {
    console.error("Error initializing the database connection:", error);
    throw error;
  }
}

function databaseMiddleware(req, res, next) {
  req.db = dbInstance; // Attach the database connection to the request object
  next();
}

module.exports = { initializeDatabase, databaseMiddleware };
