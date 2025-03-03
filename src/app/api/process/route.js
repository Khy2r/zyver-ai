import { NextResponse } from 'next/server';
import { processReportDirectly } from './utils';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const { report } = await request.json();
    
    if (!report) {
      return NextResponse.json({ 
        error: "No report text provided" 
      }, { status: 400 });
    }
    
    console.log("Received report:", report);
    
    try {
      // Process the report directly in JavaScript
      console.log("Processing report directly in JavaScript");
      const credentials = process.env.GOOGLE_CREDENTIALS 
        ? JSON.parse(process.env.GOOGLE_CREDENTIALS)
        : JSON.parse(fs.readFileSync(path.join(process.cwd(), 'credentials.json'), 'utf8'));
      const processedData = processReportDirectly(report);
      console.log("Processed data:", processedData);
      
      return NextResponse.json(processedData);
    } catch (directError) {
      console.error("Direct processing error:", directError);
      return NextResponse.json({ 
        error: `Processing error: ${directError.message}` 
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Process API error:", error);
    return NextResponse.json({ 
      error: `Server error: ${error.message}` 
    }, { status: 500 });
  }
} 