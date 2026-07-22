const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const html = fs.readFileSync('Pide Ahora Sticker.html', 'utf8');
const manifestStart = html.indexOf('<script type="__bundler/manifest">') + '<script type="__bundler/manifest">'.length;
const manifestEnd = html.indexOf('</script>', manifestStart);
const manifestStr = html.substring(manifestStart, manifestEnd).trim();

const manifest = JSON.parse(manifestStr);
const outDir = 'public/images';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

for (const uuid in manifest) {
  const entry = manifest[uuid];
  if (entry.mime.startsWith('image/')) {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) {
      try {
        bytes = zlib.gunzipSync(bytes);
      } catch(e) {
         console.error('Failed to unzip', uuid);
      }
    }
    const ext = entry.mime.split('/')[1].split('+')[0]; // e.g. svg+xml -> svg
    const filename = `sticker_${uuid}.${ext}`;
    fs.writeFileSync(path.join(outDir, filename), bytes);
    console.log('Extracted to', filename);
  }
}
