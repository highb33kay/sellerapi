// authMiddleware.js
const basicAuth = require("express-basic-auth");
const { client } = require("../db/mongo");

async function validateCredentials(username, password) {
  const myDB = client.db("olist");
  const sellersCollection = myDB.collection("olist_sellers_dataset");

  try {
    // Find the seller by username (seller_id) and password (seller_zip_code_prefix)
    const seller = await sellersCollection.findOne({
      seller_id: username,
      seller_zip_code_prefix: password,
    });

    // Check if the seller is found
    if (!seller) {
      console.error("Seller not found");
      return false;
    }

    // Return the seller object
    return seller;
  } catch (error) {
    console.error("Error validating credentials:", error);
    return false;
  }
}

// Custom middleware to set req.seller
async function setSeller(req, res, next) {
  const username = req.auth.user;
  const password = req.auth.password;

  const seller = await validateCredentials(username, password);

  if (seller !== false) {
    req.seller = seller;
    console.log(req.seller, "req.seller");
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

function myAuthorizer(username, password) {
  //   return true if validate credentials function returns a seller object
  //   return false otherwise
  const seller = validateCredentials(username, password);
  if (seller) {
    return true;
  } else {
    return false;
  }
}

function authMiddleware() {
  return [basicAuth({ challenge: true, authorizer: myAuthorizer }), setSeller];
}

module.exports = authMiddleware;
