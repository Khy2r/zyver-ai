// Function to process the report directly in JavaScript
export function processReportDirectly(reportText) {
  try {
    // Split the report into lines
    const lines = reportText.trim().split("\n");
    
    // Extract data from each line
    const data = {};
    
    for (const line of lines) {
      if (line.startsWith("Name:")) {
        data.name = line.replace("Name:", "").trim();
      } else if (line.startsWith("Date:")) {
        data.date = line.replace("Date:", "").trim();
      } else if (line.startsWith("Outreach Sent:")) {
        data.outreach_sent = parseInt(line.replace("Outreach Sent:", "").trim());
      } else if (line.startsWith("Replies:")) {
        data.replies = parseInt(line.replace("Replies:", "").trim());
      } else if (line.startsWith("Follow ups:")) {
        data.follow_ups = parseInt(line.replace("Follow ups:", "").trim());
      } else if (line.startsWith("Proposed Calls:")) {
        data.proposed_calls = parseInt(line.replace("Proposed Calls:", "").trim());
      } else if (line.startsWith("Booked calls:")) {
        data.booked_calls = parseInt(line.replace("Booked calls:", "").trim());
      }
    }
    
    // Calculate rates
    if (data.outreach_sent && data.replies) {
      data.reply_rate = parseFloat(((data.replies / data.outreach_sent) * 100).toFixed(2));
    } else {
      data.reply_rate = 0;
    }
    
    if (data.replies && data.booked_calls) {
      data.booking_rate = parseFloat(((data.booked_calls / data.replies) * 100).toFixed(2));
    } else {
      data.booking_rate = 0;
    }
    
    return data;
  } catch (error) {
    console.error("Error processing report directly:", error);
    throw new Error(`Failed to process report: ${error.message}`);
  }
} 