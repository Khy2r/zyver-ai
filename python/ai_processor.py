import sys
import json
import os
import importlib.util
import requests

# Get the absolute path to the discord-bot-project directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(os.path.dirname(current_dir))  # Go up two levels
discord_bot_path = os.path.join(project_root, "discord-bot-project")

# Add the discord-bot-project to the Python path
sys.path.append(discord_bot_path)

# API endpoint - update this to your actual website URL with the correct path
API_URL = "https://khyzrahmed.com/api/process"  # Production URL
# API key - should match what you set in your .env.local file
API_KEY = "524c078d86ca48a003c96d4a82567c21a7545781c8204aaf2c6dbd716dd460d6"

# Flag to track if we should try local processing
use_local_processing = True

# Import your AI module from the discord bot project (as fallback)
try:
    # Set OpenAI API key from command line argument
    if len(sys.argv) > 5:
        os.environ["OPENAI_API_KEY"] = sys.argv[5]

    # Check if API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("Warning: OpenAI API key is not set. Web app processing only.")
        use_local_processing = False
    else:
        from bot.report_processor import process_report_text
except ImportError as e:
    print(f"Warning: Failed to import AI module: {str(e)}. Web app processing only.")
    use_local_processing = False


def process_report_with_webapp(report_text, spreadsheet_id=None, sheet_name=None):
    """Send the report to the web app for processing and saving to Google Sheets"""
    headers = {"Content-Type": "application/json"}

    # Format the data to match what the /api/process endpoint expects
    data = {"report": report_text}

    try:
        print(f"Sending report to web app at {API_URL}")
        response = requests.post(API_URL, headers=headers, json=data)

        # Print response status for debugging
        print(f"Response status: {response.status_code}")

        # Try to get response text
        try:
            response_text = response.text
            print(f"Response text: {response_text[:200]}...")
        except:
            print("Could not get response text")

        response.raise_for_status()

        result = response.json()

        if "error" in result:
            print(f"Error from web app: {result['error']}")
            return None

        print("Report processed successfully by web app")
        return result
    except Exception as e:
        print(f"Error sending report to web app: {e}")
        return None


def process_report(file_path, format_type, spreadsheet_id=None, sheet_name=None):
    try:
        # Read the report text from the file
        with open(file_path, "r") as f:
            report_text = f.read()

        # First try using the web app
        print("Attempting to process report with web app...")
        webapp_result = process_report_with_webapp(
            report_text, spreadsheet_id, sheet_name
        )

        if webapp_result:
            print("Successfully processed with web app")
            return webapp_result

        # Fallback to local processing if web app fails and local processing is available
        if use_local_processing:
            print("Web app processing failed, falling back to local processing...")
            result = process_report_text(report_text, spreadsheet_id, sheet_name)

            # If result is a string (error message), convert to dict
            if isinstance(result, str):
                result = {"error": result}

            # Return the result directly
            return result
        else:
            return {
                "error": "Web app processing failed and local processing is not available"
            }

    except Exception as e:
        import traceback

        traceback_str = traceback.format_exc()
        return {"error": f"Processing error: {str(e)}\n{traceback_str}"}


def test_api_endpoint():
    """Test if the API endpoint is accessible"""
    try:
        # Try a simple POST request with minimal data
        test_response = requests.post(
            API_URL,
            headers={"Content-Type": "application/json"},
            json={"report_text": "Test"},
        )
        print(f"Test POST response status: {test_response.status_code}")
        print(f"Test POST response: {test_response.text[:200]}...")

        return test_response.status_code == 200
    except Exception as e:
        print(f"Error testing API endpoint: {e}")
        return False


if __name__ == "__main__":
    # Test the API endpoint
    print("Testing API endpoint...")
    test_api_endpoint()

    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input file provided"}))
        sys.exit(1)

    file_path = sys.argv[1]
    format_type = sys.argv[2] if len(sys.argv) > 2 else "standard"

    # Get optional spreadsheet ID and sheet name
    spreadsheet_id = sys.argv[3] if len(sys.argv) > 3 else None
    sheet_name = sys.argv[4] if len(sys.argv) > 4 else None

    # Process the report
    result = process_report(file_path, format_type, spreadsheet_id, sheet_name)
    print(json.dumps(result))
