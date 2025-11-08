const pool = require("../config/db");
const { parseCSV } = require("../utils/csvParser");
const { generateCSV } = require("../utils/csvGenerator");
const { validateApartmentData } = require("../utils/apartmentValidation");

const importApartments = async (req, res) => {
  try {
    // Get owner_id from session (logged in user)
    const ownerId = req.session.userId;
    
    if (!ownerId) {
      return res.status(401).json({ error: "You must be logged in to import apartments" });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const { headers, rows } = parseCSV(csvContent);

    // Expected columns (without owner_id - it comes from session)
    const expectedColumns = ['title', 'description', 'price', 'location'];
    
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

      // Insert apartment with owner_id from session
      try {
        await pool.query(
          `INSERT INTO apartments (title, description, price, location, owner_id) 
           VALUES ($1, $2, $3, $4, $5)`,
          [
            row.data.title,
            row.data.description,
            parseFloat(row.data.price),
            row.data.location,
            ownerId  // Use logged in user's ID
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
        a.is_available,
        a.owner_id,
        u.name as owner_name
      FROM apartments a
      LEFT JOIN users u ON a.owner_id = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCounter = 1;

    // Apply filters from query params
    if (req.query.location) {
      query += ` AND a.location ILIKE ${paramCounter}`;
      queryParams.push(`%${req.query.location}%`);
      paramCounter++;
    }

    if (req.query.min_price) {
      query += ` AND a.price >= ${paramCounter}`;
      queryParams.push(parseFloat(req.query.min_price));
      paramCounter++;
    }

    if (req.query.max_price) {
      query += ` AND a.price <= ${paramCounter}`;
      queryParams.push(parseFloat(req.query.max_price));
      paramCounter++;
    }

    if (req.query.is_available !== undefined) {
      query += ` AND a.is_available = ${paramCounter}`;
      queryParams.push(req.query.is_available === 'true');
      paramCounter++;
    }

    if (req.query.owner_id) {
      query += ` AND a.owner_id = ${paramCounter}`;
      queryParams.push(parseInt(req.query.owner_id));
      paramCounter++;
    }

    query += ` ORDER BY a.id DESC`;

    // Execute query
    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No apartments found with the given filters" });
    }

    // Fields to export (excluding sensitive data)
    const fields = ['id', 'title', 'description', 'price', 'location', 'is_available', 'owner_id', 'owner_name'];
    
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