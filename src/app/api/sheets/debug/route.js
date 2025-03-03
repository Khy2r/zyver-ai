import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    // Get the request body and log it
    const requestBody = await request.json();
    console.log("Full request body:", JSON.stringify(requestBody, null, 2));
    
    const { data, spreadsheetId, sheetName } = requestBody;
    
    if (!data || !spreadsheetId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing data or spreadsheet ID" 
      }, { status: 400 });
    }
    
    console.log("Data type:", typeof data);
    console.log("Data keys:", Object.keys(data));
    console.log("Spreadsheet ID:", spreadsheetId);
    console.log("Sheet name:", sheetName);
    
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
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    
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
    
    // Use the provided sheet name or default to Sheet1
    const actualSheetName = sheetName || 'Sheet1';
    
    // Log the data values to check for undefined or null
    console.log("Data values:");
    console.log("date:", data.date);
    console.log("name:", data.name);
    console.log("outreach_sent:", data.outreach_sent);
    console.log("replies:", data.replies);
    console.log("follow_ups:", data.follow_ups);
    console.log("proposed_calls:", data.proposed_calls);
    console.log("booked_calls:", data.booked_calls);
    
    // Calculate rates - handle potential missing fields safely
    const outreach = parseInt(data.outreach_sent) || 0;
    const replies = parseInt(data.replies) || 0;
    const booked = parseInt(data.booked_calls) || 0;
    const followUps = parseInt(data.follow_ups) || 0;
    const proposedCalls = parseInt(data.proposed_calls) || 0;
    
    const replyRate = outreach > 0 ? (replies / outreach * 100).toFixed(2) + '%' : '0%';
    const bookingRate = replies > 0 ? (booked / replies * 100).toFixed(2) + '%' : '0%';
    
    // Create the row data
    const rowData = [
      data.date || '',
      data.name || '',
      outreach.toString(),
      replies.toString(),
      followUps.toString(),
      proposedCalls.toString(),
      booked.toString(),
      replyRate,
      bookingRate
    ];
    
    console.log("Row data prepared:", rowData);
    console.log("Appending to range:", `${actualSheetName}!A:I`);
    
    try {
      // First, try to get the spreadsheet to verify it exists
      console.log("Verifying spreadsheet exists...");
      const spreadsheetInfo = await sheets.spreadsheets.get({
        spreadsheetId
      });
      
      console.log("Spreadsheet title:", spreadsheetInfo.data.properties.title);
      console.log("Sheets:", spreadsheetInfo.data.sheets.map(sheet => sheet.properties.title));
      
      // Check if the sheet exists
      const sheetExists = spreadsheetInfo.data.sheets.some(
        sheet => sheet.properties.title === actualSheetName
      );
      
      if (!sheetExists) {
        console.error(`Sheet "${actualSheetName}" not found in the spreadsheet`);
        return NextResponse.json({ 
          success: false, 
          error: `Sheet "${actualSheetName}" not found in the spreadsheet` 
        }, { status: 400 });
      }
      
      console.log(`Sheet "${actualSheetName}" found in the spreadsheet`);
      
      // Append the data to the sheet
      console.log("Appending data to sheet...");
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${actualSheetName}!A:I`,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: [rowData]
        }
      });
      
      console.log("Data appended successfully!");
      console.log("Response:", JSON.stringify(response.data, null, 2));
      console.log("Updated range:", response.data.updates.updatedRange);
      
      return NextResponse.json({ 
        success: true, 
        updatedRange: response.data.updates.updatedRange
      });
    } catch (apiError) {
      console.error("Google Sheets API error:", apiError.message);
      console.error("Error details:", apiError.response?.data || "No details available");
      
      return NextResponse.json({ 
        success: false, 
        error: apiError.message || "Google Sheets API error",
        details: apiError.response?.data || "No details available"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in debug endpoint:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to process request" 
    }, { status: 500 });
  }
} 