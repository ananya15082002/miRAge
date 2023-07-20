import requests
from bs4 import BeautifulSoup
import json

url = "https://en.wikipedia.org/wiki/Olympic_Games"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

# Find all paragraphs on the page
paragraphs = soup.find_all("p")

# Extract the text from each paragraph
text_data = [paragraph.get_text(strip=True) for paragraph in paragraphs]

# Create a dictionary to store the data
data = {"text_data": text_data}

# Save the data to a JSON file
filename = "text_data.json"
with open(filename, "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4)

print("Text data saved to", filename)

