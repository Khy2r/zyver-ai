import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report'; // We'll create this model next

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: "Not authenticated" 
      }, { status: 401 });
    }
    
    const { report } = await request.json();
    
    if (!report) {
      return NextResponse.json({ 
        success: false, 
        error: "No report data provided" 
      }, { status: 400 });
    }
    
    // Connect to database
    await connectDB();
    
    // Save report to database
    const newReport = new Report({
      ...report,
      userId: session.user.id,
      createdAt: new Date()
    });
    
    await newReport.save();
    
    return NextResponse.json({ 
      success: true, 
      reportId: newReport._id
    });
  } catch (error) {
    console.error("Save report error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to save report" 
    }, { status: 500 });
  }
} 