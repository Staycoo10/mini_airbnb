const express = require("express");
const session = require("express-session");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const apartamentRoutes = require("./routes/apartments");

const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/apartments", apartamentRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Mini-Airbnb backend is running!");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});