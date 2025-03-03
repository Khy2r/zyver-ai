import requests
import json

# List of URLs to test
urls_to_test = [
    "https://khyzrahmed.com/api/process",
    "https://www.khyzrahmed.com/api/process",
    "https://khyzrahmed.com/api/sheets/append",
    "https://www.khyzrahmed.com/api/sheets/append",
]


def test_url(url):
    print(f"\nTesting URL: {url}")

    # Test GET request
    try:
        response = requests.get(url)
        print(f"GET status: {response.status_code}")
        print(f"GET response: {response.text[:100]}...")
    except Exception as e:
        print(f"GET error: {e}")

    # Test POST request with minimal data
    try:
        response = requests.post(
            url, headers={"Content-Type": "application/json"}, json={"test": "data"}
        )
        print(f"POST status: {response.status_code}")
        print(f"POST response: {response.text[:100]}...")
    except Exception as e:
        print(f"POST error: {e}")


if __name__ == "__main__":
    print("API Endpoint Test Script")
    print("=======================")

    for url in urls_to_test:
        test_url(url)
