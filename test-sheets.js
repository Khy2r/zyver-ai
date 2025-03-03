const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

async function testGoogleSheetsAPI() {
  try {
    console.log("Starting Google Sheets API test...");
    
    // Path to credentials file
    const credentialsPath = path.join(__dirname, 'credentials.json');
    
    // Check if credentials file exists
    if (!fs.existsSync(credentialsPath)) {
      console.error("Credentials file not found at:", credentialsPath);
      return;
    }
    
    console.log("Credentials file found at:", credentialsPath);
    
    // Load the credentials
    const credentials = require(credentialsPath);
    
    console.log("Credentials loaded successfully");
    console.log("Client email:", credentials.client_email);
    
    // Create a JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    // Create the sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Use a test spreadsheet ID - this should be a spreadsheet you've shared with the service account
    // You can get this from the URL of your Google Sheet
    const testSpreadsheetId = "1xL8HDCKSPiCzj57urjZigVPGWtNU7YTb7dDnxUj7Hl0"; // Replace with your actual spreadsheet ID
    
    console.log("Getting spreadsheet info...");
    
    // Get spreadsheet info
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: testSpreadsheetId
    });
    
    console.log("Spreadsheet title:", spreadsheetInfo.data.properties.title);
    console.log("Sheets:", spreadsheetInfo.data.sheets.map(sheet => sheet.properties.title));
    
    // Now try to append a test row
    const testRow = ["Test", "Data", new Date().toISOString()];
    
    console.log("Appending test row...");
    
    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId: testSpreadsheetId,
      range: "Sheet1!A:C",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [testRow]
      }
    });
    
    console.log("Test row appended successfully!");
    console.log("Updated range:", appendResult.data.updates.updatedRange);
    
    console.log("Google Sheets API test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.message);
    console.error("Error stack:", error.stack);
  }
}

// Run the test
testGoogleSheetsAPI(); 