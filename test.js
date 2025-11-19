// Script pentru a genera un fișier CSV mai mare de 2MB
// Rulează cu: node generate_large_csv.js

const fs = require('fs');

// Header CSV
let csvContent = 'title,description,price,location\n';

// Generăm ~60,000 rânduri pentru a asigura > 2MB
const numberOfRows = 60000;

console.log('Generating large CSV file...');
console.log(`Creating ${numberOfRows} rows...`);

for (let i = 1; i <= numberOfRows; i++) {
  // Variază datele pentru realism
  const titles = [
    'Modern Apartment',
    'Cozy Studio',
    'Luxury Villa',
    'Downtown Flat',
    'Spacious Loft',
    'City Center Apartment',
    'Penthouse Suite',
    'Garden House'
  ];
  
  const locations = ['Chisinau', 'Balti', 'Orhei', 'Cahul', 'Soroca', 'Ungheni'];
  
  const title = `${titles[i % titles.length]} ${i}`;
  
  // Descriere lungă pentru a crește dimensiunea fișierului
  const description = `Beautiful and spacious apartment located in the heart of the city. This property features modern amenities, excellent transportation links, and is perfect for families or young professionals. The apartment has been recently renovated and includes all necessary furniture and appliances. Row number ${i}.`;
  
  const price = (Math.random() * 500 + 100).toFixed(2);
  const location = locations[i % locations.length];
  
  csvContent += `${title},"${description}",${price},${location}\n`;
  
  // Progress indicator
  if (i % 10000 === 0) {
    console.log(`Progress: ${i}/${numberOfRows} rows generated...`);
  }
}

// Salvează fișierul
const filename = 'test_large_file.csv';
fs.writeFileSync(filename, csvContent);

// Verifică dimensiunea
const stats = fs.statSync(filename);
const fileSizeInBytes = stats.size;
const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);

console.log('\n✅ CSV file generated successfully!');
console.log(`📁 Filename: ${filename}`);
console.log(`📏 Size: ${fileSizeInMB} MB (${fileSizeInBytes} bytes)`);
console.log(`📊 Rows: ${numberOfRows} + 1 header`);

if (fileSizeInMB > 2) {
  console.log('✅ File is larger than 2MB - perfect for testing!');
} else {
  console.log('⚠️  File is smaller than 2MB - increase numberOfRows');
}