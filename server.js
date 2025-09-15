const express = require("express");
const pool = require("./db");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true only if using HTTPS
  })
);

app.post("/register", async (req, res) => {
  const { name, email, idnp, password, role } = req.body;

  try {
    // Basic validation
    const allowedDomains = ["gmail.com", "mail.com", "yahoo.com", "icloud.com"]; 
    const emailParts = email.split("@");
    if (emailParts.length !== 2 || !allowedDomains.includes(emailParts[1])) {
      return res.status(400).json({ error: "Email must be from an allowed domain (e.g., gmail.com)" });
    }
       if (idnp.length !== 13 || isNaN(idnp)) {
      return res.status(400).json({
        error: "IDNP must contain exactly 13 numeric digits",
      });
    }
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
  } 
  catch (err) {
    console.error("Register error:", err.message);
    
      if (err.code === "23505") { 
  return res.status(400).json({ error: "Email already in use" });
}
res.status(500).send("Error registering user");
  } 
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const user = userResult.rows[0];

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // 3. Save user in session
    req.session.userId = user.id;

    res.json({ message: "Logged in successfully!", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } 
  catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully!" });
  });
});

//  Home route
app.get("/", (req, res) => {
  res.send("Mini-Airbnb backend is running!");
});



app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});