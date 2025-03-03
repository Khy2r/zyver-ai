import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { JWT } from 'google-auth-library';

export async function GET(request) {
  try {
    // Path to credentials file
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    
    // Check if credentials file exists
    if (!fs.existsSync(credentialsPath)) {
      console.error("Credentials file not found at:", credentialsPath);
      return NextResponse.json({ 
        success: false, 
        error: "Google Sheets credentials file not found" 
      }, { status: 500 });
    }
    
    // Load the credentials
    const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsFile);
    
    console.log("Credentials loaded successfully");
    console.log("Client email:", credentials.client_email);
    
    // Create a JWT client
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Get an access token
    const token = await client.getAccessToken();
    console.log("Token obtained successfully");
    
    // Use a test spreadsheet ID - this should be a spreadsheet you've shared with the service account
    // You can get this from the URL of your Google Sheet
    const testSpreadsheetId = "1xL8HDCKSPiCzj57urjZigVPGWtNU7YTb7dDnxUj7Hl0"; // Replace with your actual spreadsheet ID
    
    // Make a simple API call to get spreadsheet info
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${testSpreadsheetId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API error:", errorText);
      throw new Error(`Google Sheets API error: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log("Spreadsheet info:", responseData.properties?.title);
    
    // Now try to append a test row
    const testRow = ["Test", "Data", new Date().toISOString()];
    
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${testSpreadsheetId}/values/Sheet1!A:C:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [testRow]
        }),
      }
    );
    
    if (!appendResponse.ok) {
      const appendErrorText = await appendResponse.text();
      console.error("Append error:", appendErrorText);
      throw new Error(`Failed to append test row: ${appendErrorText}`);
    }
    
    const appendData = await appendResponse.json();
    console.log("Test row appended successfully:", appendData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Google Sheets API is working correctly",
      spreadsheetTitle: responseData.properties?.title,
      appendResult: appendData
    });
  } catch (error) {
    console.error("Test failed:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Test failed" 
    }, { status: 500 });
  }
} 