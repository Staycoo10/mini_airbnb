const express = require("express");
const pool = require("./db");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: "./.env" });

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, // for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

app.post("/register", async (req, res) => {
  const { name, email, idnp, password, role } = req.body;

  try {
    // 1) Hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2) Insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, idnp, password, role) VALUES ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING id, name, email, role",
      [name, email, idnp, hashedPassword, role]
    );

    // 3) Save user id in session
    req.session.userId = newUser.rows[0].id;

    // 4) Send response
    res.json({
      message: "User registered and logged in!",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).send("Error registering user");
  }
});



//  Home route
app.get("/", (req, res) => {
  res.send("Mini-Airbnb backend is running!");
});

//  Test database connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ database_time: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Database connection error");
  }
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});