import { NextResponse } from 'next/server';
import { processReportDirectly } from '../../process/utils';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// API key for authentication (should match what your Python bot uses)
const API_KEY = process.env.BOT_API_KEY || 'your-secret-api-key';

export async function POST(request) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${API_KEY}`) {
      console.error("Unauthorized bot request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { report_text, spreadsheet_id, sheet_name } = await request.json();
    
    if (!report_text) {
      return NextResponse.json({ 
        error: "No report text provided" 
      }, { status: 400 });
    }
    
    console.log("Received report from bot:", report_text);
    
    try {
      // Process the report
      const processedData = processReportDirectly(report_text);
      console.log("Processed bot report:", processedData);
      
      // Save to Google Sheets if spreadsheet_id is provided
      if (spreadsheet_id) {
        // Path to credentials file
        const credentialsPath = path.join(process.cwd(), 'credentials.json');
        
        // Check if credentials file exists
        if (!fs.existsSync(credentialsPath)) {
          console.error("Credentials file not found at:", credentialsPath);
          return NextResponse.json({ 
            error: "Google Sheets credentials file not found",
            processed_data: processedData
          }, { status: 500 });
        }
        
        // Load the credentials
        const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        
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
        const actualSheetName = sheet_name || 'Sheet1';
        
        // Calculate rates - handle potential missing fields safely
        const outreach = parseInt(processedData.outreach_sent) || 0;
        const replies = parseInt(processedData.replies) || 0;
        const booked = parseInt(processedData.booked_calls) || 0;
        const followUps = parseInt(processedData.follow_ups) || 0;
        const proposedCalls = parseInt(processedData.proposed_calls) || 0;
        
        const replyRate = outreach > 0 ? (replies / outreach * 100).toFixed(2) + '%' : '0%';
        const bookingRate = replies > 0 ? (booked / replies * 100).toFixed(2) + '%' : '0%';
        
        // Create the row data
        const rowData = [
          processedData.date || '',
          processedData.name || '',
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
        
        // Append the data to the sheet
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
          processed_data: processedData,
          sheets_result: {
            updated_range: response.data.updates.updatedRange
          }
        });
      }
      
      // If no spreadsheet_id, just return the processed data
      return NextResponse.json({ 
        success: true, 
        processed_data: processedData 
      });
    } catch (error) {
      console.error("Error processing bot report:", error);
      return NextResponse.json({ 
        error: `Processing error: ${error.message}` 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Bot API error:", error);
    return NextResponse.json({ 
      error: `Server error: ${error.message}` 
    }, { status: 500 });
  }
} 