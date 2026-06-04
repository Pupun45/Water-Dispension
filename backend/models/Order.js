const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_id:       { type: String, required: true, unique: true }, // Cashfree order_id
    amount:         { type: Number, required: true },               // ₹ paid
    liters:         { type: Number, required: true },               // litres dispensed
    mobile:         { type: String, default: null },                // customer phone
    remaining_water:{ type: Number, default: null },                // tank remaining after deduction
    payment_status: { type: String, default: "PAID" },             // PAID | FAILED | PENDING
  },
  { timestamps: true }   // adds createdAt & updatedAt automatically
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
