const express = require("express");
const router  = express.Router();

const {
  recordRequest,
  setRequest,
  createOrder,
  paymentSuccess,
} = require("../controllers/paymentController");

// POST /tank/request      → record pending dispense (no deduction)
router.post("/tank/request",     recordRequest);

// POST /tank/set-request  → set request & deduct after redirect
router.post("/tank/set-request", setRequest);

// POST /create-order      → create a Cashfree payment order
router.post("/create-order",     createOrder);

// GET  /payment-success   → verify Cashfree payment & deduct water
router.get("/payment-success",   paymentSuccess);

module.exports = router;
