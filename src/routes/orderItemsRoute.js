// orderItemsRoute.js
const express = require("express");
const router = express.Router();
const {
  getOrderItems,
  deleteOrderItem,
} = require("../controllers/orderItemsController");

router.get("/order_items", getOrderItems);

router.delete("/order_items/:id", deleteOrderItem);

module.exports = router;
