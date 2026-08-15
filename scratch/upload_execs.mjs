import fs from 'fs';
import path from 'path';

const CLOUD_NAME = 'q9jb9wvk';
const UPLOAD_PRESET = 'ahefss_uploads';
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const filesToUpload = [
  { key: 'presidentSpeech', path: path.resolve('public/assets/President speech Picture .jpg') },
  { key: 'president', path: path.resolve('public/assets/Meet your executives_/President Abdulwarees_.jpg') },
  { key: 'vicePresident', path: path.resolve('public/assets/Meet your executives_/Vice president.jpg') },
  { key: 'pro2', path: path.resolve('public/assets/Meet your executives_/PRO 2.jpg') },
];

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    default: return 'application/octet-stream';
  }
}

async function uploadFile(item) {
  if (!fs.existsSync(item.path)) {
    console.error(`File not found: ${item.path}`);
    return null;
  }
  const buffer = fs.readFileSync(item.path);
  const mimeType = getMimeType(item.path);
  const blob = new Blob([buffer], { type: mimeType });

  const formData = new FormData();
  formData.append('file', blob, path.basename(item.path));
  formData.append('upload_preset', UPLOAD_PRESET);

  console.log(`Uploading ${path.basename(item.path)} (${buffer.length} bytes)...`);
  const res = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed for ${item.key}: ${res.status} ${errText}`);
  }

  const data = await res.json();
  console.log(`Success [${item.key}]: ${data.secure_url}`);
  return { key: item.key, url: data.secure_url };
}

async function main() {
  const results = {};
  for (const item of filesToUpload) {
    try {
      const res = await uploadFile(item);
      if (res) results[res.key] = res.url;
    } catch (e) {
      console.error(e);
    }
  }
  console.log('\n--- ALL RESULTS ---');
  console.log(JSON.stringify(results, null, 2));
}

main();
