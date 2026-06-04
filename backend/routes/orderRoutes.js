const express = require("express");
const router  = express.Router();

const { getAllOrders, getOrderById } = require("../controllers/orderController");

// GET /orders              → all orders (newest first), supports ?limit= & ?mobile=
router.get("/",           getAllOrders);

// GET /orders/:order_id    → single order by Cashfree order_id
router.get("/:order_id",  getOrderById);

module.exports = router;
