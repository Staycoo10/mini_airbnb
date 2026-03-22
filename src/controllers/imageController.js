const pool = require("../config/db");

// Adauga imagine la apartament
const addImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;
    const owner_id = req.session.userId;

    if (!url) return res.status(400).json({ error: "URL is required" });

    // verifica ca apartamentul ii apartine
    const apt = await pool.query("SELECT * FROM apartments WHERE id=$1 AND owner_id=$2", [id, owner_id]);
    if (apt.rows.length === 0) return res.status(403).json({ error: "Not your apartment" });

    // pozitia urmatoare
    const posResult = await pool.query(
      "SELECT COALESCE(MAX(position), -1) + 1 as next_pos FROM apartment_images WHERE apartment_id=$1",
      [id]
    );
    const position = posResult.rows[0].next_pos;

    const result = await pool.query(
      "INSERT INTO apartment_images (apartment_id, url, position) VALUES ($1, $2, $3) RETURNING *",
      [id, url, position]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("addImage error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Sterge imagine
const deleteImage = async (req, res) => {
  try {
    const { id, imageId } = req.params;
    const owner_id = req.session.userId;

    // verifica ownership prin JOIN
    const result = await pool.query(
      `DELETE FROM apartment_images ai
       USING apartments a
       WHERE ai.id=$1 AND ai.apartment_id=$2 AND a.id=$2 AND a.owner_id=$3
       RETURNING ai.*`,
      [imageId, id, owner_id]
    );

    if (result.rows.length === 0) return res.status(403).json({ error: "Not found or not your apartment" });
    res.json({ message: "Image deleted" });
  } catch (error) {
    console.error("deleteImage error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Ia toate imaginile unui apartament
const getImages = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM apartment_images WHERE apartment_id=$1 ORDER BY position ASC",
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addImage, deleteImage, getImages };