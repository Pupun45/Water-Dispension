const express = require("express");
const router  = express.Router();

const {
  getAllTanks,
  createTank,
  getTankById,
  updateTank,
  deleteTank,
} = require("../controllers/tankController");

// GET    /tank           → list all tanks
router.get("/",     getAllTanks);

// POST   /tank           → create a new tank
router.post("/",    createTank);

// GET    /tank/:id       → get one tank by ID
router.get("/:id",  getTankById);

// PUT    /tank/:id       → update one tank
router.put("/:id",  updateTank);

// DELETE /tank/:id       → delete one tank
router.delete("/:id", deleteTank);

module.exports = router;
