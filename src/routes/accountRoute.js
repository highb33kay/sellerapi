const express = require("express");
const router = express.Router();

const { updateSellerAccount } = require("../controllers/account"); // Adjust the path as needed
// Define the route for updating seller
router.patch("/account", updateSellerAccount);

// Export the router
module.exports = router;
