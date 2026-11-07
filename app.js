require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const db_connect = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoice");

const allowedOrigins = [
  "https://tatero-apf.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true,
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", {
    apiBaseUrl: `${req.protocol}://${req.get("host")}/api`,
    endpoints: [
      {
        method: "POST",
        path: "/auth/signup",
        description: "Create an account",
      },
      { method: "POST", path: "/auth/signin", description: "Sign in" },
      { method: "POST", path: "/invoices", description: "Create an invoice" },
      { method: "GET", path: "/invoices", description: "List invoices" },
      {
        method: "GET",
        path: "/invoices/range",
        description: "List invoices by date range",
      },
      { method: "GET", path: "/invoices/:id", description: "Get an invoice" },
      {
        method: "PUT",
        path: "/invoices/:id",
        description: "Update an invoice",
      },
      {
        method: "DELETE",
        path: "/invoices/:id",
        description: "Delete an invoice",
      },
    ],
  });
});

app.use("/api", authRoutes);
app.use("/api", invoiceRoutes);

const startServer = async () => {
  try {
    await db_connect(process.env.MONGODB_URI);
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
