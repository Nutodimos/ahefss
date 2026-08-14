const fs = require('fs');
const path = require('path');

const CLOUD_NAME = 'q9jb9wvk';
const UPLOAD_PRESET = 'ahefss_uploads';
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const directoriesToScan = [
  { path: 'c:/Users/Admin/Documents/VS code/AHEFSS', recursive: false },
  { path: 'c:/Users/Admin/Documents/VS code/AHEFSS/Merchandise_', recursive: true },
  { path: 'c:/Users/Admin/Documents/VS code/AHEFSS/ahefss/public/assets', recursive: true }
];

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp']);
const uploadedMapping = {};

async function uploadImage(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const mimeType = getMimeType(filePath);
  const blob = new Blob([fileBuffer], { type: mimeType });
  
  const formData = new FormData();
  const filename = path.basename(filePath);
  formData.append('file', blob, filename);
  formData.append('upload_preset', UPLOAD_PRESET);
  
  // optionally set folder based on relative path if we want
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`Uploaded ${filename} -> ${data.secure_url}`);
    uploadedMapping[filePath] = data.secure_url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
  }
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    case '.webp': return 'image/webp';
    default: return 'application/octet-stream';
  }
}

async function scanAndUpload(dir, recursive = true) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (recursive && !fullPath.includes('node_modules') && !fullPath.includes('.next') && !fullPath.includes('.git')) {
        await scanAndUpload(fullPath, recursive);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (imageExtensions.has(ext)) {
        await uploadImage(fullPath);
      }
    }
  }
}

async function main() {
  for (const dirConfig of directoriesToScan) {
    console.log(`Scanning ${dirConfig.path}...`);
    await scanAndUpload(dirConfig.path, dirConfig.recursive);
  }
  
  fs.writeFileSync('c:/Users/Admin/Documents/VS code/AHEFSS/ahefss/scratch/cloudinary_urls.json', JSON.stringify(uploadedMapping, null, 2));
  console.log('Uploads complete! Mapping saved to cloudinary_urls.json');
}

main();
