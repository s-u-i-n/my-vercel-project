const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Current Orange theme
    content = content.replace(/bg-\[#ea580c\]/g, 'bg-red-500');
    content = content.replace(/text-\[#ea580c\]/g, 'text-red-500');
    content = content.replace(/focus:ring-\[#ea580c\]/g, 'focus:ring-red-500');
    content = content.replace(/ring-\[#ea580c\]/g, 'ring-red-500');
    content = content.replace(/border-\[#ea580c\]/g, 'border-red-500');
    content = content.replace(/hover:bg-\[#c2410c\]/g, 'hover:bg-red-600');
    content = content.replace(/bg-orange-50/g, 'bg-red-50');
    content = content.replace(/text-orange-600/g, 'text-red-500');
    
    // Register page Green
    content = content.replace(/bg-green-600/g, 'bg-red-500');
    content = content.replace(/hover:bg-green-700/g, 'hover:bg-red-600');

    // Login page Blue
    content = content.replace(/bg-blue-600/g, 'bg-red-500');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-red-600');
    content = content.replace(/text-blue-600/g, 'text-red-500');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
