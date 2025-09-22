const pool = require("../config/db");

// Get all apartments
const getApartments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM apartments ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Get single apartment
const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM apartments WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Apartment not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Create apartment
const createApartment = async (req, res) => {
  try {
    const { title, description, location, price, is_available, owner_id } = req.body;
    const result = await pool.query(
      `INSERT INTO apartments (title, description, location, price, is_available, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, location, price, is_available, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Update apartment
const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, price, is_available } = req.body;
    const result = await pool.query(
      `UPDATE apartments
       SET title=$1, description=$2, location=$3, price=$4, is_available=$5
       WHERE id=$6 RETURNING *`,
      [title, description, location, price, is_available, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Apartment not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

// Delete apartment
const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM apartments WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Apartment not found" });
    }
    res.json({ message: "Apartment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
};