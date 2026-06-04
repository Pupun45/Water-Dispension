const Tank = require("../models/Tank");

/* ─────────────────────────────────────────────────────────────
   TANK CRUD CONTROLLERS
   GET    /tank           → getAllTanks
   POST   /tank           → createTank
   GET    /tank/:id       → getTankById
   PUT    /tank/:id       → updateTank
   DELETE /tank/:id       → deleteTank
───────────────────────────────────────────────────────────── */

/**
 * GET /tank
 * Returns all tanks with computed deducted_water field.
 */
const getAllTanks = async (req, res) => {
  try {
    const tanks = await Tank.find();

    const result = tanks.map(tank => {
      const hasManual = tank.deducted_water !== undefined && tank.deducted_water !== null;
      const deducted  = hasManual
        ? tank.deducted_water
        : tank.tank_capacity - tank.remaining;
      return { ...tank.toObject(), deducted_water: deducted };
    });

    console.log(`[GET /tank] Returning ${result.length} tank(s)`);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tank data" });
  }
};

/**
 * POST /tank
 * Creates a new tank document.
 */
const createTank = async (req, res) => {
  try {
    const {
      name, tank_capacity, remaining, tds, ph_level, turbidity,
      dissolved_o2, water_temp, env_temp, water_level,
      deducted_water, request,
    } = req.body;

    if (tank_capacity === undefined || remaining === undefined) {
      return res.status(400).json({ error: "tank_capacity and remaining are required" });
    }

    const tank = await Tank.create({
      name:           name !== undefined ? String(name) : "",
      tank_capacity:  Number(tank_capacity),
      remaining:      Number(remaining),
      tds:            tds           !== undefined ? Number(tds)           : null,
      ph_level:       ph_level      !== undefined ? Number(ph_level)      : null,
      turbidity:      turbidity     !== undefined ? Number(turbidity)     : null,
      dissolved_o2:   dissolved_o2  !== undefined ? Number(dissolved_o2)  : null,
      water_temp:     water_temp    !== undefined ? Number(water_temp)    : null,
      env_temp:       env_temp      !== undefined ? Number(env_temp)      : null,
      water_level:    water_level   !== undefined ? Number(water_level)   : null,
      deducted_water: deducted_water !== undefined ? Number(deducted_water) : null,
      request:        request       !== undefined ? Number(request)       : 0,
    });

    console.log(`[POST /tank] Created tank: ${tank._id}`);
    res.status(201).json({ message: "Tank created", tank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create tank" });
  }
};

/**
 * GET /tank/:id
 * Returns a single tank with computed deducted_water.
 */
const getTankById = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: "Tank not found" });

    const hasManual = tank.deducted_water !== undefined && tank.deducted_water !== null;
    const deducted  = hasManual
      ? tank.deducted_water
      : tank.tank_capacity - tank.remaining;

    console.log(`[GET /tank/${req.params.id}] remaining: ${tank.remaining}`);
    res.json({ ...tank.toObject(), deducted_water: deducted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tank" });
  }
};

/**
 * PUT /tank/:id
 * Updates an existing tank's sensor fields.
 */
const updateTank = async (req, res) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) return res.status(404).json({ error: "Tank not found" });

    const fields = [
      "tank_capacity", "remaining", "tds", "ph_level", "turbidity",
      "dissolved_o2", "water_temp", "env_temp", "water_level", "request",
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        tank[field] = Number(req.body[field]);
      }
    });

    if (req.body.name !== undefined) {
      tank.name = String(req.body.name);
    }

    // deducted_water: raw override — accept even 0, clear with null
    if (Object.prototype.hasOwnProperty.call(req.body, "deducted_water")) {
      tank.deducted_water = req.body.deducted_water !== null
        ? Number(req.body.deducted_water)
        : null;
    }

    await tank.save();
    console.log(`[PUT /tank/${req.params.id}] Updated`);
    res.json({ message: "Tank updated", tank });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update tank" });
  }
};

/**
 * DELETE /tank/:id
 * Removes a tank document by ID.
 */
const deleteTank = async (req, res) => {
  try {
    const tank = await Tank.findByIdAndDelete(req.params.id);
    if (!tank) return res.status(404).json({ error: "Tank not found" });

    console.log(`[DELETE /tank/${req.params.id}] Deleted`);
    res.json({ message: "Tank deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete tank" });
  }
};

module.exports = { getAllTanks, createTank, getTankById, updateTank, deleteTank };
