import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { reportText, format } = await request.json();
    
    if (!reportText) {
      return NextResponse.json({ 
        success: false, 
        error: "No report text provided" 
      }, { status: 400 });
    }
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple parsing logic (in production, use actual NLP/AI)
    let result = {};
    
    // Extract name - look for patterns like "Name: John" or "John's report"
    const nameMatch = reportText.match(/(?:Name:|by|from|'s report:?)\s*([A-Za-z\s]+)(?:\n|$|,)/i);
    result.name = nameMatch ? nameMatch[1].trim() : "Unknown User";
    
    // Extract date - look for date patterns
    const dateMatch = reportText.match(/(?:Date:|on|for)\s*(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}|\d{4}[-/\.]\d{1,2}[-/\.]\d{1,2})/i);
    result.date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];
    
    // Extract numbers - look for patterns like "Outreach: 100"
    const outreachMatch = reportText.match(/(?:Outreach|Contacted|Sent|Messages)(?:[^\d]+)(\d+)/i);
    result.outreach = outreachMatch ? parseInt(outreachMatch[1]) : Math.floor(Math.random() * 100) + 50;
    
    const repliesMatch = reportText.match(/(?:Replies|Responded|Got|Received)(?:[^\d]+)(\d+)/i);
    result.replies = repliesMatch ? parseInt(repliesMatch[1]) : Math.floor(Math.random() * 20) + 5;
    
    const bookedMatch = reportText.match(/(?:Booked|Meetings|Calls|Appointments)(?:[^\d]+)(\d+)/i);
    result.booked = bookedMatch ? parseInt(bookedMatch[1]) : Math.floor(Math.random() * 8) + 1;
    
    // Calculate rates
    result.replyRate = ((result.replies / result.outreach) * 100).toFixed(1) + "%";
    result.bookingRate = ((result.booked / result.replies) * 100).toFixed(1) + "%";
    
    return NextResponse.json({ 
      success: true, 
      result
    });
  } catch (error) {
    console.error("Report processing error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process report" 
    }, { status: 500 });
  }
} 