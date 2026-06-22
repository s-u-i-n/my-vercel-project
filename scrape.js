const fs = require('fs');

async function searchImage(query) {
    try {
        const res = await fetch(`https://images.search.yahoo.com/search/images?p=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        const html = await res.text();
        const match = html.match(/<img src='([^']+)'/);
        if (match) {
            console.log(`${query}: ${match[1]}`);
        } else {
            console.log(`${query}: Not found`);
        }
    } catch (e) {
        console.log(`${query}: Error - ${e.message}`);
    }
}

async function main() {
    const queries = ["죠스떡볶이", "신전떡볶이", "엽기떡볶이", "버거킹 와퍼", "마라탕", "홍콩반점 짜장면", "보쌈", "쉐이크쉑 버거", "초밥"];
    for (const q of queries) {
        await searchImage(q);
    }
}

main();
