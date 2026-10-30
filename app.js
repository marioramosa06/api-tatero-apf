require("dotenv").config();
const express = require("express");
const app = express();
const db_connect = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const invoiceRoutes = require("./routes/invoice");

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);
app.use("/api", invoiceRoutes);

db_connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(8000, () => {
      console.log(`Server running on http://localhost:8000`);
    });
  })
  .catch((err) => console.error("Database connection error:", err));
