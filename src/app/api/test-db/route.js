import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json(
      { message: "Database connection successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database connection error:", error);
    
    return NextResponse.json(
      { 
        message: "Database connection failed", 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 