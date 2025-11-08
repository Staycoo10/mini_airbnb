const generateCSV = (data, fields) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Create headers
  const headers = fields.join(',');
  
  // Create rows
  const rows = data.map(item => {
    return fields.map(field => {
      let value = item[field] || '';
      
      // Escape quotes and wrap in quotes if contains comma or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
};

module.exports = { generateCSV };