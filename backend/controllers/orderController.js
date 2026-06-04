const Order = require("../models/Order");

/* ─────────────────────────────────────────────────────────────
   ORDER CONTROLLERS
   GET  /orders           → getAllOrders  (sorted newest first)
   GET  /orders/:order_id → getOrderById  (by Cashfree order_id)
───────────────────────────────────────────────────────────── */

/**
 * GET /orders
 * Returns all orders from MongoDB, sorted newest first.
 * Optional query params:
 *   ?limit=20          → max records returned (default 50)
 *   ?mobile=9876543210 → filter by customer mobile
 */
const getAllOrders = async (req, res) => {
  try {
    const limit  = Math.min(parseInt(req.query.limit) || 50, 200);
    const filter = {};
    if (req.query.mobile) filter.mobile = req.query.mobile;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    console.log(`[GET /orders] Returning ${orders.length} order(s)`);
    res.json({ count: orders.length, orders });
  } catch (err) {
    console.error("[GET /orders] Error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * GET /orders/:order_id
 * Returns a single order by Cashfree order_id string.
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ order_id: req.params.order_id }).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });

    console.log(`[GET /orders/${req.params.order_id}] Found`);
    res.json(order);
  } catch (err) {
    console.error("[GET /orders/:id] Error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

module.exports = { getAllOrders, getOrderById };
