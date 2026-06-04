require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const bodyParser = require("body-parser");

const connectDB      = require("./config/db");
const tankRoutes     = require("./routes/tankRoutes");
const paymentRoutes  = require("./routes/paymentRoutes");
const orderRoutes    = require("./routes/orderRoutes");
const adminRoutes    = require("./routes/adminRoutes");
const Admin          = require("./models/Admin");

/* ─── App Setup ─────────────────────────────────────────────── */
const app          = express();
const port         = process.env.PORT || 3567;
const FRONTEND_URL = process.env.FRONTEND_URL;

console.log("CORS Allowed Origin:", FRONTEND_URL);

/* ─── Middleware ─────────────────────────────────────────────── */
app.use(bodyParser.json());
app.use(cors({
  origin: [FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(express.static("public"));

/* ─── Database ───────────────────────────────────────────────── */
const seedAdmin = async () => {
  try {
    const admins = await Admin.find({ id: "admin" });
    if (admins.length > 1) {
      const keep = admins[0];
      await Admin.deleteMany({ id: "admin", _id: { $ne: keep._id } });
      console.log("🧹 Cleaned up duplicate 'admin' accounts.");
    } else if (admins.length === 0) {
      await Admin.create({ id: "admin", password: "Water@2024" });
      console.log("🌱 Default admin account seeded: admin / Water@2024");
    }
  } catch (err) {
    console.error("❌ Failed to seed default admin:", err);
  }
};

connectDB().then(() => {
  seedAdmin();
});

/* ─── Routes ─────────────────────────────────────────────────── */
app.use("/tank",    tankRoutes);    // /tank CRUD
app.use("/orders",  orderRoutes);   // /orders — order history
app.use("/admin",   adminRoutes);   // /admin routes
app.use("/",        paymentRoutes); // /tank/request, /create-order, /payment-success

/* ─── Start Server ───────────────────────────────────────────── */
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
