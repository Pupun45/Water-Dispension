const fs    = require("fs");
const path  = require("path");
const Order = require("../models/Order");

const ORDERS_FILE = path.join(__dirname, "..", "order.json");

// Ensure the JSON backup file still exists
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

/**
 * Persist a completed order to MongoDB (primary) and order.json (backup).
 *
 * @param {{ order_id: string, amount: number, liters: number, mobile?: string, remaining_water: number, payment_status: string }} order
 */
async function saveOrder(order) {
  // ── 1. Save to MongoDB ─────────────────────────────────────
  try {
    await Order.create({
      order_id:        order.order_id,
      amount:          order.amount,
      liters:          order.liters,
      mobile:          order.mobile      || null,
      remaining_water: order.remaining_water,
      payment_status:  order.payment_status || "PAID",
    });
    console.log(`[orderStore] ✅ Order ${order.order_id} saved to MongoDB`);
  } catch (err) {
    // Duplicate key = already saved (idempotent); other errors get logged
    if (err.code === 11000) {
      console.warn(`[orderStore] ⚠️ Order ${order.order_id} already exists in MongoDB — skipping`);
    } else {
      console.error("[orderStore] ❌ MongoDB save failed:", err.message);
    }
  }

  // ── 2. Also append to order.json (backup / legacy) ─────────
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
    orders.push({ ...order, saved_at: new Date().toISOString() });
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (err) {
    console.error("[orderStore] ❌ JSON backup failed:", err.message);
  }
}

/**
 * In-memory Set to prevent double-deduction on duplicate /payment-success calls.
 * NOTE: Resets on server restart. MongoDB unique index on order_id provides
 * persistent protection.
 * @type {Set<string>}
 */
const processedOrders = new Set();

module.exports = { saveOrder, processedOrders };
