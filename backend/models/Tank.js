const mongoose = require("mongoose");

const tankSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────
    name:           { type: String, default: "" },      // Dispenser / tank name

    // ── Core capacity & dispensing ──────────────────────────
    tank_capacity:  { type: Number, required: true },   // litres (max volume)
    remaining:      { type: Number, required: true },   // litres (current level)
    water_level:    { type: Number, default: null },    // % or cm from sensor
    deducted_water: { type: Number, default: null },    // manual override (null = auto)
    request:        { type: Number, default: 0 },       // pending dispense (IoT trigger)

    // ── Water-quality sensors ───────────────────────────────
    tds:            { type: Number, default: null },    // Total Dissolved Solids (ppm)
    ph_level:       { type: Number, default: null },    // pH (0-14)
    turbidity:      { type: Number, default: null },    // NTU
    dissolved_o2:   { type: Number, default: null },    // Dissolved Oxygen (mg/L)

    // ── Temperature sensors ─────────────────────────────────
    water_temp:     { type: Number, default: null },    // Water temperature (°C)
    env_temp:       { type: Number, default: null },    // Ambient / env temperature (°C)
  },
  { timestamps: true }
);

const Tank = mongoose.model("Tank", tankSchema);

module.exports = Tank;
