const express = require("express");
const router  = express.Router();

const {
  loginAdmin,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

// POST   /admin/login        → authenticate admin
router.post("/login", loginAdmin);

// GET    /admin/accounts     → list admin accounts
router.get("/accounts", getAllAdmins);

// POST   /admin/accounts     → create a new admin
router.post("/accounts", createAdmin);

// PUT    /admin/accounts/:id → update an admin
router.put("/accounts/:id", updateAdmin);

// DELETE /admin/accounts/:id → delete an admin
router.delete("/accounts/:id", deleteAdmin);

module.exports = router;
