import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { JWT } from 'google-auth-library';

export async function POST(request) {
  try {
    const { data, spreadsheetId, sheetName } = await request.json();
    
    if (!data || !spreadsheetId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing data or spreadsheet ID" 
      }, { status: 400 });
    }
    
    console.log("Received data for direct sheets API:", data);
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
    const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsFile);
    
    console.log("Credentials loaded successfully");
    
    // Create a JWT client
    const client = new JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    // Get an access token
    const token = await client.getAccessToken();
    
    // Use a simple sheet name
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
    
    // Prepare the request body
    const requestBody = {
      values: [rowData]
    };
    
    // Make a direct API call to Google Sheets
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${actualSheetName}'!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Sheets API error:", errorText);
      
      // Try with unquoted sheet name
      const retryResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${actualSheetName}!A:I:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );
      
      if (!retryResponse.ok) {
        const retryErrorText = await retryResponse.text();
        console.error("Retry error:", retryErrorText);
        throw new Error(`Google Sheets API error: ${retryErrorText}`);
      }
      
      const retryData = await retryResponse.json();
      console.log("Success with unquoted sheet name:", retryData);
      
      return NextResponse.json({ 
        success: true, 
        updatedRange: retryData.updates?.updatedRange || 'Unknown range'
      });
    }
    
    const responseData = await response.json();
    console.log("Success with quoted sheet name:", responseData);
    
    return NextResponse.json({ 
      success: true, 
      updatedRange: responseData.updates?.updatedRange || 'Unknown range'
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