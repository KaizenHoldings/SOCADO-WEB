const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('Pide Ahora Sticker.html', 'utf8');
const manifestStart = html.indexOf('<script type="__bundler/manifest">') + '<script type="__bundler/manifest">'.length;
const manifestEnd = html.indexOf('</script>', manifestStart);
const manifestStr = html.substring(manifestStart, manifestEnd).trim();

const manifest = JSON.parse(manifestStr);

for (const uuid in manifest) {
  const entry = manifest[uuid];
  if (entry.mime === 'text/babel' || entry.mime === 'text/javascript') {
    let bytes = Buffer.from(entry.data, 'base64');
    if (entry.compressed) {
      bytes = zlib.gunzipSync(bytes);
    }
    fs.writeFileSync('sticker_extracted_' + uuid + '.jsx', bytes);
    console.log('Extracted to sticker_extracted_' + uuid + '.jsx');
  }
}
