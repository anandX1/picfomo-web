const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const heroDir = 'F:/startup/picfomo/public/hero';
const files = fs.readdirSync(heroDir);

async function convert() {
    console.log("🚀 Starting AI Image Optimization Engine...");
    for (const file of files) {
        if (file.endsWith('.png')) {
            const inputPath = path.join(heroDir, file);
            const outputPath = path.join(heroDir, file.replace('.png', '.webp'));
            
            console.log(`Converting ${file} -> WebP...`);
            await sharp(inputPath)
                .webp({ quality: 80, effort: 6 })
                .toFile(outputPath);
            
            const oldSize = fs.statSync(inputPath).size / 1024 / 1024;
            const newSize = fs.statSync(outputPath).size / 1024 / 1024;
            console.log(`✅ ${file} optimized: ${oldSize.toFixed(2)}MB -> ${newSize.toFixed(2)}MB`);
        }
    }
    console.log("✨ All Hero images are now High-Performance WebP!");
}

convert().catch(console.error);
