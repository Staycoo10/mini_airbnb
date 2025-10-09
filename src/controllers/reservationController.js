const pool = require("../config/db");

// ✅ Creare rezervare
const createReservation = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { apartment_id, start_date, end_date } = req.body;

    // verificăm dacă utilizatorul este logat
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // verificăm dacă apartamentul există și e disponibil
    const aptResult = await pool.query("SELECT * FROM apartments WHERE id=$1", [apartment_id]);
    if (aptResult.rows.length === 0) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    // inserăm rezervarea
    const newRes = await pool.query(
      `INSERT INTO reservations (user_id, apartment_id, start_date, end_date, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [userId, apartment_id, start_date, end_date]
    );

    res.json({ message: "Reservation created", reservation: newRes.rows[0] });
  } catch (err) {
    console.error("Create reservation error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Afișare rezervările utilizatorului curent
const getMyReservations = async (req, res) => {
  try {
    const userId = req.session.userId;
    const result = await pool.query(
      "SELECT * FROM reservations WHERE user_id=$1 ORDER BY start_date DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get reservations error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Anulare rezervare
const cancelReservation = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM reservations WHERE id=$1 AND user_id=$2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found or not yours" });
    }

    res.json({ message: "Reservation cancelled", deleted: result.rows[0] });
  } catch (err) {
    console.error("Cancel reservation error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// ✅ Pentru admin: toate rezervările
const getAllReservations = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS user_name, a.title AS apartment_title
       FROM reservations r
       JOIN users u ON r.user_id = u.id
       JOIN apartments a ON r.apartment_id = a.id
       ORDER BY r.start_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get all reservations error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
  getAllReservations
};