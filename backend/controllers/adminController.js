const Admin = require("../models/Admin");

// Login admin
const loginAdmin = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) {
      return res.status(400).json({ error: "ID and Password are required" });
    }

    const admin = await Admin.findOne({ id });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: "Invalid Admin ID or password" });
    }

    res.json({ message: "Login successful", admin: { id: admin.id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login" });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("id password");
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin accounts" });
  }
};

// Create a new admin
const createAdmin = async (req, res) => {
  try {
    const { id, password } = req.body;
    const trimId = id ? id.trim() : "";
    const trimPwd = password ? password.trim() : "";

    if (!trimId || !trimPwd) {
      return res.status(400).json({ error: "ID and Password cannot be empty" });
    }

    const existing = await Admin.findOne({ id: trimId });
    if (existing) {
      return res.status(400).json({ error: "That ID already exists" });
    }

    const newAdmin = await Admin.create({ id: trimId, password: trimPwd });
    res.status(201).json({ message: "Admin account created successfully", admin: newAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create admin account" });
  }
};

// Update an admin account
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params; // old id / username
    const { newId, password } = req.body;
    const trimNewId = newId ? newId.trim() : "";
    const trimPwd = password ? password.trim() : "";

    if (!trimNewId || !trimPwd) {
      return res.status(400).json({ error: "ID and Password cannot be empty" });
    }

    // Find the admin being edited
    const admin = await Admin.findOne({ id });
    if (!admin) {
      return res.status(404).json({ error: "Admin account not found" });
    }

    // If ID is changing, check for duplicates
    if (trimNewId !== admin.id) {
      const duplicate = await Admin.findOne({ id: trimNewId });
      if (duplicate) {
        return res.status(400).json({ error: "That ID already exists" });
      }
    }

    admin.id = trimNewId;
    admin.password = trimPwd;
    await admin.save();

    res.json({ message: "Credentials updated successfully", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update admin account" });
  }
};

// Delete an admin account
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params; // username id
    
    // Check total count to prevent deleting the last admin
    const count = await Admin.countDocuments();
    if (count <= 1) {
      return res.status(400).json({ error: "Cannot delete the last admin account" });
    }

    const admin = await Admin.findOneAndDelete({ id });
    if (!admin) {
      return res.status(404).json({ error: "Admin account not found" });
    }

    res.json({ message: "Account deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete admin account" });
  }
};

module.exports = { loginAdmin, getAllAdmins, createAdmin, updateAdmin, deleteAdmin };
