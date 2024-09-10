import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

// Define the file path to the Excel file
const filePath = path.resolve('./divstation.xlsx');

// Function to convert Excel file to JSON
const convertExcelToJson = (filePath) => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Convert the sheet to JSON
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Output the JSON data
    console.log(sheetData);

    // Write the JSON data to a file
    const jsonFilePath = filePath.replace('.xlsx', '.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(sheetData, null, 2));
    console.log(`Excel data converted to JSON and saved to ${jsonFilePath}`);
  } catch (error) {
    console.error('Error converting Excel to JSON:', error);
  }
};

// Convert Excel file to JSON
convertExcelToJson(filePath);
