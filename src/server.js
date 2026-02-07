const cors = require("cors");
const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const apartamentRoutes = require("./routes/apartments");
const reservationRoutes = require("./routes/reservations");
const configureMiddleware = require("./config/middleware");
const app = express();
 app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
// Middleware
configureMiddleware(app);
// Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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