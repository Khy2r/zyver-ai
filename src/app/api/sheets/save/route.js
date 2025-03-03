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
    
    console.log("Received data:", data);
    
    // Path to credentials file
    const credentialsPath = path.join(process.cwd(), 'credentials.json');
    
    // Check if credentials file exists
    if (!fs.existsSync(credentialsPath)) {
      return NextResponse.json({ 
        success: false, 
        error: "Google Sheets credentials file not found" 
      }, { status: 500 });
    }
    
    // Load the credentials
    const credentials = require(credentialsPath);
    
    // Create a JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    
    // Create the sheets API client
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Use a simple sheet name
    const actualSheetName = sheetName || 'Sheet1';
    
    // Calculate rates - handle potential missing fields safely
    const outreach = data.outreach_sent || 0;
    const replies = data.replies || 0;
    const booked = data.booked_calls || 0;
    const followUps = data.follow_ups || 0;
    const proposedCalls = data.proposed_calls || 0;
    
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
    
    console.log("Sending row data to sheets:", rowData);
    
    try {
      // First, try to get the spreadsheet to verify it exists
      await sheets.spreadsheets.get({
        spreadsheetId
      });
      
      // Append the data to the sheet - use the sheet name directly
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${actualSheetName}!A:I`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [rowData]
        }
      });
      
      return NextResponse.json({ 
        success: true, 
        updatedRange: response.data.updates.updatedRange
      });
    } catch (sheetsError) {
      console.error("Google Sheets API error:", sheetsError.message);
      
      // Try again with quotes around the sheet name
      try {
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: `'${actualSheetName}'!A:I`,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [rowData]
          }
        });
        
        return NextResponse.json({ 
          success: true, 
          updatedRange: response.data.updates.updatedRange
        });
      } catch (retryError) {
        throw new Error(`Failed after retry: ${retryError.message}`);
      }
    }
  } catch (error) {
    console.error("Error saving to Google Sheets:", error.message);
    console.error("Error stack:", error.stack);
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Failed to save to Google Sheets" 
    }, { status: 500 });
  }
} 