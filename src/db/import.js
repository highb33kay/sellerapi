// import.js
const fs = require("fs");
// process env
require("dotenv/config");
const csv = require("csv-parser");
const { MongoClient } = require("mongodb");

const url = process.env.MONGO_URL;
const dbName = "olist";

async function importCSV(filePath, collectionName) {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Read CSV file and insert data into MongoDB
    const data = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          data.push(row);
        })
        .on("end", async () => {
          try {
            await collection.insertMany(data);
            console.log(`Imported data into ${collectionName} collection`);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await client.close();
    console.log("Closed database connection");
  }
}

async function clearDatabase() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected to the database");

    const db = client.db(dbName);

    // Drop the entire database
    await db.dropDatabase();
    console.log("Database cleared");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await client.close();
    console.log("Closed database connection");
  }
}

// clearDatabase();

// Import olist_order_items_dataset.csv
importCSV("olist_order_items_dataset.csv", "olist_order_items_dataset");

// Import olist_products_dataset.csv
importCSV("olist_products_dataset.csv", "olist_products_dataset");

// Import olist_sellers_dataset.csv
importCSV("olist_sellers_dataset.csv", "olist_sellers_dataset");
