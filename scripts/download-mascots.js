const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'mascots');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const characters = ['dino', 'bunny', 'panda', 'tiger', 'frog', 'penguin', 'cat', 'bear', 'fox'];
const types = ['directions', 'reactions'];

async function downloadAll() {
  for (const char of characters) {
    for (const t of types) {
      const filename = `${char}-${t}.webp`;
      const filePath = path.join(targetDir, filename);
      if (fs.existsSync(filePath)) {
        console.log(`Already exists: ${filename}`);
        continue;
      }
      const url = `https://raw.githubusercontent.com/nilbuild/page-mascot/main/public/mascots/${filename}`;
      console.log(`Downloading ${filename}...`);
      try {
        const res = await fetch(url);
        if (!res.ok) {
          console.error(`Failed to download ${filename}: status ${res.status}`);
          continue;
        }
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`Saved ${filename} (${buffer.length} bytes)`);
      } catch (err) {
        console.error(`Error downloading ${filename}:`, err);
      }
    }
  }
}

downloadAll().then(() => console.log('All downloads completed!'));
