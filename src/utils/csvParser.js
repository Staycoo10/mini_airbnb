const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  
  return values;
};

const parseCSV = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length !== headers.length) {
      rows.push({
        valid: false,
        rowNumber: i + 1,
        error: `Column count mismatch. Expected ${headers.length}, got ${values.length}`,
        data: null
      });
      continue;
    }

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    
    rows.push({
      valid: true,
      rowNumber: i + 1,
      data: row
    });
  }

  return { headers, rows };
};

module.exports = { parseCSV };