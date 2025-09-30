const express = require("express");
const productRoutes = require("./routes/product.routes");
const paymentRoutes = require("./routes/payment.routes");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
