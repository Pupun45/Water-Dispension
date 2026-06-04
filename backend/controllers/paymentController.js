const Tank                          = require("../models/Tank");
const cashfree                      = require("../config/cashfree");
const { saveOrder, processedOrders } = require("../utils/orderStore");

const FRONTEND_URL = process.env.FRONTEND_URL;

/* ─────────────────────────────────────────────────────────────
   PAYMENT / DISPENSING CONTROLLERS
   POST /tank/request       → recordRequest
   POST /tank/set-request   → setRequest
   POST /create-order       → createOrder
   GET  /payment-success    → paymentSuccess
───────────────────────────────────────────────────────────── */

/**
 * POST /tank/request
 * Records the pending dispense volume WITHOUT deducting remaining.
 * Deduction only happens after confirmed payment in paymentSuccess.
 */
const recordRequest = async (req, res) => {
  try {
    const { request } = req.body;

    if (request === undefined || request === null) {
      return res.status(400).json({ error: "request is required" });
    }

    const numericRequest = Number(request);
    if (Number.isNaN(numericRequest) || numericRequest < 0) {
      return res.status(400).json({ error: "Invalid request value" });
    }

    // Only set the request field — remaining is NOT touched here
    const tank = await Tank.findOneAndUpdate(
      {},
      { request: numericRequest },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    console.log(`[POST /tank/request] Recorded pending request: ${tank.request}L (remaining unchanged: ${tank.remaining}L)`);

    res.json({
      message:   "Request recorded — water will be deducted after payment",
      request:   tank.request,
      remaining: tank.remaining,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process request" });
  }
};

/**
 * POST /tank/set-request
 * Called from bill.html after redirect — directly deducts remaining.
 * Used when Cashfree redirects back without going through /payment-success.
 */
const setRequest = async (req, res) => {
  try {
    const { liters, order_id } = req.body;
    console.log(`[set-request] BODY RECEIVED: liters=${liters}, order_id=${order_id}`);

    const used = Number(liters);
    if (!used || used <= 0) {
      return res.status(400).json({ error: `Invalid liters value: ${liters}` });
    }

    const tank = await Tank.findOne();
    if (!tank) return res.status(404).json({ error: "Tank not found" });

    console.log(`[set-request] BEFORE: request=${tank.request}, remaining=${tank.remaining}`);

    tank.request   = used;
    tank.remaining = Math.max(0, tank.remaining - used);
    await tank.save();

    console.log(`✅ [set-request] SAVED: request=${tank.request}, remaining=${tank.remaining}`);

    res.json({
      message:   "Dispense request set",
      request:   tank.request,
      remaining: tank.remaining,
    });
  } catch (err) {
    console.error("❌ [set-request] Error:", err);
    res.status(500).json({ error: "Failed to set request" });
  }
};

/**
 * POST /create-order
 * Creates a Cashfree payment order for the requested water volume.
 */
const createOrder = async (req, res) => {
  try {
    const { amount, mobile, liters } = req.body;

    if (!amount || !mobile || !liters) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const tank = await Tank.findOne();
    if (!tank) return res.status(404).json({ error: "Tank not found" });

    if (liters > tank.remaining) {
      return res.status(400).json({
        error:     "INSUFFICIENT_WATER",
        available: tank.remaining,
      });
    }

    const orderId = `order_${Date.now()}`;

    const orderRequest = {
      order_id:       orderId,
      order_amount:   Number(amount),
      order_currency: "INR",
      customer_details: {
        customer_id:    mobile,
        customer_name:  "Water User",
        customer_email: "test@example.com",
        customer_phone: mobile,
      },
      order_meta: {
        return_url: `${FRONTEND_URL}/bill.html?order_id=${orderId}&amount=${amount}&liters=${liters}&mobile=${mobile}`,
      },
    };

    const response = await cashfree.PGCreateOrder(orderRequest);

    res.json({
      payment_session_id: response.data.payment_session_id,
      order_id:           response.data.order_id,
      remaining:          tank.remaining,
      tds:                tank.tds,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || "Order creation failed" });
  }
};

/**
 * GET /payment-success
 * Verifies payment with Cashfree and deducts water (idempotent — once per order_id).
 */
const paymentSuccess = async (req, res) => {
  const { order_id, liters, mobile } = req.query;
  console.log(`[payment-success] Verifying order: ${order_id}, liters: ${liters}, mobile: ${mobile}`);

  try {
    const response = await cashfree.PGFetchOrder(order_id);

    if (response.data.order_status === "PAID") {
      const used       = Number(liters) || 0;
      const paidAmount = response.data.order_amount;

      // ── Idempotency guard ──────────────────────────────────────
      if (processedOrders.has(order_id)) {
        console.log(`[payment-success] ⚠️ Order ${order_id} already processed — skipping deduction`);
        const tank = await Tank.findOne();
        return res.json({
          message:   "Already processed",
          request:   tank?.request   ?? 0,
          remaining: tank?.remaining ?? 0,
          amount:    paidAmount,
        });
      }
      processedOrders.add(order_id);
      // ──────────────────────────────────────────────────────────

      // Deduct remaining & set request AFTER confirmed payment
      const tank = await Tank.findOneAndUpdate(
        {},
        {
          $set: { request: used },
          $inc: { remaining: -used },
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      if (!tank) return res.status(404).json({ error: "Tank not found" });

      console.log(`✅ [payment-success] Deducted ${used}L → remaining: ${tank.remaining}L (order: ${order_id}, amount: ₹${paidAmount})`);

      await saveOrder({
        order_id,
        amount:          paidAmount,
        liters:          used,
        mobile:          mobile || null,
        remaining_water: tank.remaining,
        payment_status:  "PAID",
      });

      return res.json({
        message:   "Payment verified & water deducted",
        request:   tank.request,
        remaining: tank.remaining,
        amount:    paidAmount,
      });

    } else {
      console.log(`❌ [payment-success] Not paid: ${response.data.order_status}`);
      return res.status(402).json({ error: "Payment not completed", status: response.data.order_status });
    }
  } catch (err) {
    console.error("❌ [payment-success] Error:", err);
    return res.status(500).json({ error: "Failed to verify payment" });
  }
};

module.exports = { recordRequest, setRequest, createOrder, paymentSuccess };
