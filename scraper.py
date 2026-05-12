import requests
from bs4 import BeautifulSoup
import json

url = "https://liquipedia.net/mobilelegends/MPL/Indonesia/Season_15/Statistics"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

soup = BeautifulSoup(response.text, "html.parser")

heroes = []

# cari tabel hero statistics
table = soup.find("table", class_="wikitable")

rows = table.find_all("tr")

for row in rows:

    cols = row.find_all("td")

    # skip kalau bukan row data
    if len(cols) < 10:
        continue

    try:

        texts = [c.get_text(strip=True) for c in cols]

        print(texts)

        hero = texts[1]

        # ambil data yang BENAR
        picks = texts[2]
        wr = texts[5]

        # skip kalau bukan hero
        if hero in ["RRQ", "AE", "BTR", "ONIC", "DEWA"]:
            continue

        # skip kalau bukan nama hero
        if len(hero) <= 2:
            continue

        heroes.append({
            "hero": hero,
            "pickrate": picks,
            "winrate": wr
        })

    except Exception as e:
        print(e)

# ambil 3 pertama
heroes = heroes[:30]

with open("heroes.json", "w", encoding="utf-8") as f:
    json.dump(heroes, f, indent=2)

print("SUCCESS SCRAPING MPL DATA")