const pool = require("../config/db");
const { parseCSV } = require("../utils/csvParser");
const { generateCSV } = require("../utils/csvGenerator");
const { validateApartmentData } = require("../utils/apartmentValidation");

const importApartments = async (req, res) => {
  try {
    const csvContent = req.file.buffer.toString('utf-8');
    const { headers, rows } = parseCSV(csvContent);

    // Expected columns
    const expectedColumns = ['title', 'description', 'price', 'location', 'owner_id'];
    
    // Validate headers
    const missingColumns = expectedColumns.filter(col => !headers.includes(col));
    if (missingColumns.length > 0) {
      return res.status(400).json({
        error: "Invalid CSV structure",
        missingColumns,
        expectedColumns
      });
    }

    const results = {
      total: rows.length,
      imported: 0,
      failed: 0,
      errors: []
    };

    for (const row of rows) {
      if (!row.valid) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber,
          error: row.error
        });
        continue;
      }

      // Validate data
      const validation = validateApartmentData(row.data);
      
      if (!validation.isValid) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber,
          errors: validation.errors
        });
        continue;
      }

      // Check if user exists
      const userExists = await pool.query(
        "SELECT id FROM users WHERE id = $1",
        [row.data.user_id]
      );

      if (userExists.rows.length === 0) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber,
          errors: [`User with ID ${row.data.user_id} does not exist`]
        });
        continue;
      }

      // Insert apartment
      try {
        await pool.query(
          `INSERT INTO apartments (title, description, price, location, rooms, user_id) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            row.data.title,
            row.data.description,
            parseFloat(row.data.price),
            row.data.location,
            parseInt(row.data.rooms),
            parseInt(row.data.user_id)
          ]
        );
        results.imported++;
      } catch (err) {
        results.failed++;
        results.errors.push({
          row: row.rowNumber,
          errors: [err.message]
        });
      }
    }

    res.json({
      message: "Import completed",
      results
    });

  } catch (err) {
    console.error("Import error:", err.message);
    res.status(500).json({ error: "Error importing CSV", details: err.message });
  }
};

const exportApartments = async (req, res) => {
  try {
    // Build query with filters
    let query = `
      SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.price, 
        a.location, 
        a.rooms, 
        a.user_id,
        u.name as owner_name,
        a.created_at
      FROM apartments a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Apply filters from query params
    if (req.query.location) {
      query += ` AND a.location ILIKE $${paramCounter}`;
      queryParams.push(`%${req.query.location}%`);
      paramCounter++;
    }

    if (req.query.min_price) {
      query += ` AND a.price >= $${paramCounter}`;
      queryParams.push(parseFloat(req.query.min_price));
      paramCounter++;
    }

    if (req.query.max_price) {
      query += ` AND a.price <= $${paramCounter}`;
      queryParams.push(parseFloat(req.query.max_price));
      paramCounter++;
    }

    if (req.query.rooms) {
      query += ` AND a.rooms = $${paramCounter}`;
      queryParams.push(parseInt(req.query.rooms));
      paramCounter++;
    }

    if (req.query.user_id) {
      query += ` AND a.user_id = $${paramCounter}`;
      queryParams.push(parseInt(req.query.user_id));
      paramCounter++;
    }

    query += ` ORDER BY a.created_at DESC`;

    // Execute query
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No apartments found with the given filters" });
    }

    // Fields to export (excluding sensitive data)
    const fields = ['id', 'title', 'description', 'price', 'location', 'rooms', 'user_id', 'owner_name', 'created_at'];
    
    const csv = generateCSV(result.rows, fields);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=apartments_export.csv');
    
    res.send(csv);

  } catch (err) {
    console.error("Export error:", err.message);
    res.status(500).json({ error: "Error exporting CSV", details: err.message });
  }
};

module.exports = {
  importApartments,
  exportApartments
};
