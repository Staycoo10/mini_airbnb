const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { validateEmail, validateIDNP } = require("../utils/validation");

const register = async (req, res) => {
  const { name, email, idnp, password, role } = req.body;
  
  try {
    // Validation
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ error: emailValidation.error });
    }
    
    const idnpValidation = validateIDNP(idnp);
    if (!idnpValidation.isValid) {
      return res.status(400).json({ error: idnpValidation.error });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, idnp, password, role) VALUES ($1, $2, $3, $4, COALESCE($5, 'user')) RETURNING id, name, email, role",
      [name, email, idnp, hashedPassword, role]
    );
    
    // Save user id in session
    req.session.userId = newUser.rows[0].id;
    
    // Send response
    res.json({
      message: "User registered and logged in!",
      user: newUser.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err.message);
    
    if (err.code === "23505") { 
      return res.status(400).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: "Error registering user" });
  } 
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    const user = userResult.rows[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    
    // Save user in session
    req.session.userId = user.id;
    
    res.json({ 
      message: "Logged in successfully!", 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logged out successfully!" });
  });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.session.userId]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ user: user.rows[0] });
  } catch (err) {
    console.error("Get current user error:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};