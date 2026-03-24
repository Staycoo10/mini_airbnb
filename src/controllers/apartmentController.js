const pool = require("../config/db");

const getApartments = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM apartments ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT a.*, u.name as owner_name
       FROM apartments a
       LEFT JOIN users u ON a.owner_id = u.id
       WHERE a.id = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Apartment not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createApartment = async (req, res) => {
  try {
    const { title, description, location, price, image_url } = req.body;
    const is_available = req.body.is_available !== undefined ? req.body.is_available : true;
    const owner_id = req.session.userId;
    const result = await pool.query(
      `INSERT INTO apartments (title, description, location, price, is_available, owner_id, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, location, price, is_available, owner_id, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createApartment:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, price, is_available, image_url } = req.body;
    const owner_id = req.session.userId;
    const result = await pool.query(
      `UPDATE apartments
       SET title=$1, description=$2, location=$3, price=$4, is_available=$5, image_url=$6
       WHERE id=$7 AND owner_id=$8 RETURNING *`,
      [title, description, location, price, is_available, image_url || null, id, owner_id]
    );
    if (result.rows.length === 0) return res.status(403).json({ error: "You can edit only your own apartments" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const owner_id = req.session.userId;
    const result = await pool.query(
      "DELETE FROM apartments WHERE id=$1 AND owner_id=$2 RETURNING *",
      [id, owner_id]
    );
    if (result.rows.length === 0) return res.status(403).json({ error: "You can delete only your own apartments" });
    res.json({ message: "Apartment deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyApartments = async (req, res) => {
  try {
    const owner_id = req.session.userId;
    if (!owner_id) return res.status(401).json({ error: "Not authenticated" });
    const result = await pool.query(
      "SELECT * FROM apartments WHERE owner_id=$1 ORDER BY id DESC",
      [owner_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getMyApartments:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getApartments, getApartmentById, createApartment, updateApartment, deleteApartment, getMyApartments };