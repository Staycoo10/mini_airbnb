const isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "You must be logged in" });
  }
  next(); 
};
// Check if user has admin role
function isAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // query user role from DB
  const pool = require("../config/db");
  pool.query("SELECT role FROM users WHERE id = $1", [req.session.userId])
    .then(result => {
      if (result.rows.length > 0 && result.rows[0].role === "admin") {
        return next();
      }
      return res.status(403).json({ error: "Access denied: Sellers only" });
    })
    .catch(err => {
      console.error("Role check error:", err);
      res.status(500).json({ error: "Server error" });
    });
}

module.exports = { isAuthenticated, isAdmin };