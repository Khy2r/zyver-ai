import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);

export async function POST(request) {
  try {
    const { reportText, format, spreadsheetId, sheetName } = await request.json();
    
    if (!reportText) {
      return NextResponse.json({ 
        success: false, 
        error: "No report text provided" 
      }, { status: 400 });
    }
    
    // Create a temporary file with the report text
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    const tempFilePath = path.join(tempDir, `report_${Date.now()}.txt`);
    fs.writeFileSync(tempFilePath, reportText);
    
    // Path to your Python script
    const pythonScriptPath = path.join(process.cwd(), 'python', 'ai_processor.py');
    
    // Get the OpenAI API key from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    // Remove any quotes that might be in the API key
    const cleanApiKey = openaiApiKey ? openaiApiKey.replace(/["']/g, '') : null;

    if (!cleanApiKey) {
      console.error("API Key missing. Raw value:", openaiApiKey);
      return NextResponse.json({ 
        success: false, 
        error: "OpenAI API key is not configured in the server environment" 
      }, { status: 500 });
    }
    
    // Build the command with optional parameters
    let command = `python ${pythonScriptPath} "${tempFilePath}" ${format}`;
    
    // Add spreadsheet ID if provided
    if (spreadsheetId) {
      command += ` "${spreadsheetId}"`;
      
      // Add sheet name if provided
      if (sheetName) {
        command += ` "${sheetName}"`;
      }
    }
    
    // Add the API key as the last argument
    command += ` "${cleanApiKey}"`;
    
    console.log("Executing command (API key hidden):", command.replace(cleanApiKey, "API_KEY_HIDDEN"));
    
    // Execute your Python AI script
    const { stdout, stderr } = await execPromise(command);
    
    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
    
    if (stderr && !stderr.includes('LangChainDeprecationWarning')) {
      console.error("Python script error:", stderr);
      return NextResponse.json({ 
        success: false, 
        error: "AI processing error: " + stderr 
      }, { status: 500 });
    }
    
    // Parse the output from your Python script
    let result;
    try {
      result = JSON.parse(stdout);
    } catch (e) {
      console.error("Failed to parse Python output:", stdout);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to parse AI output" 
      }, { status: 500 });
    }
    
    // Check if the result contains an error
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      result: result.data || result
    });
  } catch (error) {
    console.error("AI processing error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to process report with AI: " + error.message 
    }, { status: 500 });
  }
} 