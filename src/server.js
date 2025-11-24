const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const apartamentRoutes = require("./routes/apartments");
const reservationRoutes = require("./routes/reservations");
const configureMiddleware = require("./config/middleware");
const app = express();

// Middleware
configureMiddleware(app);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartamentRoutes);
app.use("/api/reservations", reservationRoutes);
// Home route
app.get("/", (req, res) => {
  res.send("Mini-Airbnb backend is running!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});