const validateCSVFile = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;

  // Check MIME type
  if (file.mimetype !== 'text/csv') {
    return res.status(400).json({ 
      error: "Invalid file type. Only CSV files are allowed",
      received: file.mimetype 
    });
  }

  // Check file size (max 2MB)
  const maxSize = 2 * 1024 * 1024; // 2MB in bytes
  if (file.size > maxSize) {
    return res.status(400).json({ 
      error: "File too large. Maximum size is 2MB",
      receivedSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    });
  }

  next();
};

module.exports = { validateCSVFile };