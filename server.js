const express = require("express");
const pool = require("./db");

const app = express();
app.use(express.json());

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