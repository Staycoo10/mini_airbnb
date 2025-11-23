const pool = require("../config/db");
const { validateReservationData } = require("../utils/reservationValidation");

// Crează o rezervare nouă
const createReservation = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { apartment_id, start_date, end_date } = req.body;

    // Validare date
    const validation = validateReservationData({ apartment_id, start_date, end_date });
    
    if (!validation.isValid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Verifică dacă apartamentul există
    const apartmentResult = await pool.query(
      "SELECT * FROM apartments WHERE id = $1",
      [apartment_id]
    );

    if (apartmentResult.rows.length === 0) {
      return res.status(404).json({ error: "Apartment not found" });
    }

    const apartment = apartmentResult.rows[0];

    // Verifică dacă apartamentul este disponibil
    if (!apartment.is_available) {
      return res.status(400).json({ error: "Apartment is not available" });
    }

    // Verifică overlap cu alte rezervări active
    const overlapCheck = await pool.query(
      `SELECT * FROM reservations 
       WHERE apartment_id = $1 
       AND status = 'active'
       AND (
         (start_date <= $2 AND end_date >= $2) OR
         (start_date <= $3 AND end_date >= $3) OR
         (start_date >= $2 AND end_date <= $3)
       )`,
      [apartment_id, start_date, end_date]
    );

    if (overlapCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: "Apartment is already booked for these dates",
        existingReservations: overlapCheck.rows 
      });
    }

    // Creează rezervarea
    const newReservation = await pool.query(
      `INSERT INTO reservations (user_id, apartment_id, start_date, end_date, status) 
       VALUES ($1, $2, $3, $4, 'active') 
       RETURNING *`,
      [userId, apartment_id, start_date, end_date]
    );

    // Calculează prețul total
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
    const totalPrice = (parseFloat(apartment.price) * days).toFixed(2);

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation.rows[0],
      totalPrice,
      days
    });

  } catch (err) {
    console.error("Create reservation error:", err.message);
    res.status(500).json({ error: "Error creating reservation", details: err.message });
  }
};

// Obține toate rezervările utilizatorului logat
const getUserReservations = async (req, res) => {
  try {
    const userId = req.session.userId;

    const reservations = await pool.query(
      `SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        a.id as apartment_id,
        a.title as apartment_title,
        a.location as apartment_location,
        a.price as apartment_price,
        u.name as owner_name
       FROM reservations r
       JOIN apartments a ON r.apartment_id = a.id
       JOIN users u ON a.owner_id = u.id
       WHERE r.user_id = $1
       ORDER BY r.start_date DESC`,
      [userId]
    );

    // Calculează prețul total pentru fiecare rezervare
    const reservationsWithTotal = reservations.rows.map(reservation => {
      const days = Math.ceil(
        (new Date(reservation.end_date) - new Date(reservation.start_date)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = (parseFloat(reservation.apartment_price) * days).toFixed(2);

      return {
        ...reservation,
        days,
        total_price: totalPrice
      };
    });

    res.json({
      count: reservationsWithTotal.length,
      reservations: reservationsWithTotal
    });

  } catch (err) {
    console.error("Get user reservations error:", err.message);
    res.status(500).json({ error: "Error fetching reservations", details: err.message });
  }
};

// Obține o rezervare specifică
const getReservationById = async (req, res) => {
  try {
    const userId = req.session.userId;
    const reservationId = req.params.id;

    const reservation = await pool.query(
      `SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        r.user_id,
        a.id as apartment_id,
        a.title as apartment_title,
        a.description as apartment_description,
        a.location as apartment_location,
        a.price as apartment_price,
        u.name as owner_name,
        guest.name as guest_name,
        guest.email as guest_email
       FROM reservations r
       JOIN apartments a ON r.apartment_id = a.id
       JOIN users u ON a.owner_id = u.id
       JOIN users guest ON r.user_id = guest.id
       WHERE r.id = $1`,
      [reservationId]
    );

    if (reservation.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const reservationData = reservation.rows[0];

    // Verifică permisiuni: doar proprietarul rezervării sau adminul pot vedea
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
    const userRole = userResult.rows[0].role;

    if (reservationData.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: "You don't have permission to view this reservation" });
    }

    // Calculează prețul total
    const days = Math.ceil(
      (new Date(reservationData.end_date) - new Date(reservationData.start_date)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = (parseFloat(reservationData.apartment_price) * days).toFixed(2);

    res.json({
      reservation: {
        ...reservationData,
        days,
        total_price: totalPrice
      }
    });

  } catch (err) {
    console.error("Get reservation error:", err.message);
    res.status(500).json({ error: "Error fetching reservation", details: err.message });
  }
};

// Anulează (șterge) o rezervare
const cancelReservation = async (req, res) => {
  try {
    const userId = req.session.userId;
    const reservationId = req.params.id;

    // Verifică dacă rezervarea există și aparține utilizatorului
    const reservationCheck = await pool.query(
      "SELECT * FROM reservations WHERE id = $1",
      [reservationId]
    );

    if (reservationCheck.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const reservation = reservationCheck.rows[0];

    // Verifică permisiuni
    if (reservation.user_id !== userId) {
      return res.status(403).json({ error: "You can only cancel your own reservations" });
    }

    // Verifică dacă rezervarea e deja anulată
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: "Reservation is already cancelled" });
    }

    // Anulează rezervarea (UPDATE status în loc de DELETE)
    await pool.query(
      "UPDATE reservations SET status = 'cancelled' WHERE id = $1",
      [reservationId]
    );

    res.json({ 
      message: "Reservation cancelled successfully",
      reservationId: parseInt(reservationId)
    });

  } catch (err) {
    console.error("Cancel reservation error:", err.message);
    res.status(500).json({ error: "Error cancelling reservation", details: err.message });
  }
};

// ADMIN: Obține toate rezervările din sistem
const getAllReservations = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Verifică dacă userul e admin
    const userResult = await pool.query("SELECT role FROM users WHERE id = $1", [userId]);
    
    if (userResult.rows.length === 0 || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    // Filtre opționale
    let query = `
      SELECT 
        r.id,
        r.start_date,
        r.end_date,
        r.status,
        a.id as apartment_id,
        a.title as apartment_title,
        a.location as apartment_location,
        a.price as apartment_price,
        guest.id as guest_id,
        guest.name as guest_name,
        guest.email as guest_email,
        owner.name as owner_name
       FROM reservations r
       JOIN apartments a ON r.apartment_id = a.id
       JOIN users guest ON r.user_id = guest.id
       JOIN users owner ON a.owner_id = owner.id
       WHERE 1=1
    `;

    const queryParams = [];
    let paramCounter = 1;

    // Filtru după status
    if (req.query.status) {
      query += ` AND r.status = $${paramCounter}`;
      queryParams.push(req.query.status);
      paramCounter++;
    }

    // Filtru după apartment_id
    if (req.query.apartment_id) {
      query += ` AND r.apartment_id = $${paramCounter}`;
      queryParams.push(parseInt(req.query.apartment_id));
      paramCounter++;
    }

    // Filtru după user_id (guest)
    if (req.query.user_id) {
      query += ` AND r.user_id = $${paramCounter}`;
      queryParams.push(parseInt(req.query.user_id));
      paramCounter++;
    }

    query += ` ORDER BY r.start_date DESC`;

    const reservations = await pool.query(query, queryParams);

    // Calculează prețul total pentru fiecare
    const reservationsWithTotal = reservations.rows.map(reservation => {
      const days = Math.ceil(
        (new Date(reservation.end_date) - new Date(reservation.start_date)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = (parseFloat(reservation.apartment_price) * days).toFixed(2);

      return {
        ...reservation,
        days,
        total_price: totalPrice
      };
    });

    res.json({
      count: reservationsWithTotal.length,
      reservations: reservationsWithTotal
    });

  } catch (err) {
    console.error("Get all reservations error:", err.message);
    res.status(500).json({ error: "Error fetching reservations", details: err.message });
  }
};

module.exports = {
  createReservation,
  getUserReservations,
  getReservationById,
  cancelReservation,
  getAllReservations
};