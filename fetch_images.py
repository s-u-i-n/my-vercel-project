import urllib.request
import json
import urllib.parse
import re

def get_image(query):
    # Search Wikipedia API first
    url = f"https://ko.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles={urllib.parse.quote(query)}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            pages = data["query"]["pages"]
            for page_id in pages:
                if "original" in pages[page_id]:
                    print(f"{query}: {pages[page_id]['original']['source']}")
                    return
    except Exception as e:
        pass
    print(f"{query}: Not found")

queries = ["죠스떡볶이", "신전떡볶이", "동대문 엽기떡볶이", "버거킹", "마라탕", "짜장면", "보쌈", "쉐이크쉑", "초밥"]
for q in queries:
    get_image(q)
