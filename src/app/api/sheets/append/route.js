import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const { data, spreadsheetId, sheetName } = await request.json();
    
    if (!data || !spreadsheetId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing data or spreadsheet ID" 
      }, { status: 400 });
    }
    
    console.log("Received data for sheets:", data);
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
    
    // Append the data to the sheet - use the exact same approach as the test script
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
    console.log("Updated range:", response.data.updates.updatedRange);
    
    return NextResponse.json({ 
      success: true, 
      updatedRange: response.data.updates.updatedRange
    });
  } catch (error) {
    console.error("Error saving to Google Sheets:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to save to Google Sheets" 
    }, { status: 500 });
  }
} 