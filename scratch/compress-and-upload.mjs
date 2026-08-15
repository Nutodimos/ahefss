/**
 * compress-and-upload.mjs
 * Compresses all images in public/assets using Sharp, then uploads to Cloudinary.
 * Outputs a structured JSON manifest for use in lib/assets.ts
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

// ─── Config ───────────────────────────────────────────────────────────────────
const CLOUD_NAME = 'q9jb9wvk';
const UPLOAD_PRESET = 'ahefss_uploads';
const API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const ASSETS_ROOT = path.resolve('public/assets');
const TEMP_DIR = path.resolve('scratch/compressed_temp');

// Compression settings per asset type
const COMPRESS_OPTS = {
  jpg: { quality: 80 },   // JPEG: 80% quality
  jpeg: { quality: 80 },
  png: { compressionLevel: 8, quality: 85 }, // PNG → WebP isn't used; keep PNG but compress
};

// ─── Asset Map ────────────────────────────────────────────────────────────────
// Defines the canonical structure we want in the manifest.
// key = manifest path, value = local file path (relative to ASSETS_ROOT)
const ASSET_MAP = {
  // ── Brand ──
  'brand.logo': 'Logo.jpg',
  'brand.administrationLogo': 'Administration logo.jpg',

  // ── President Section ──
  'president.speechPhoto': 'President speech Picture .jpg',

  // ── Executives ──
  'executives.president': 'Meet your executives_/President Abdulwarees_.jpg',
  'executives.vicePresident': 'Meet your executives_/Vice president.jpg',
  'executives.flyer': 'Meet your executives_/meet your executive flyer.jpg',

  // ── Events: HOD's Cup ──
  'events.hodsCup.gallery[0]': 'events/AHEFSS HOD_s Cup/IMG-20260106-WA0020.jpg',
  'events.hodsCup.gallery[1]': 'events/AHEFSS HOD_s Cup/IMG-20260109-WA0006.jpg',
  'events.hodsCup.gallery[2]': 'events/AHEFSS HOD_s Cup/IMG-20260113-WA0027.jpg',
  'events.hodsCup.gallery[3]': 'events/AHEFSS HOD_s Cup/IMG-20260124-WA0067.jpg',
  'events.hodsCup.gallery[4]': 'events/AHEFSS HOD_s Cup/IMG-20260814-WA0003(1).jpg',
  'events.hodsCup.gallery[5]': 'events/AHEFSS HOD_s Cup/IMG-20260814-WA0004.jpg',
  'events.hodsCup.gallery[6]': 'events/AHEFSS HOD_s Cup/IMG-20260814-WA0005.jpg',
  'events.hodsCup.gallery[7]': 'events/AHEFSS HOD_s Cup/Screenshot_20260814-105034.jpg',

  // ── Events: Departmental Cleanup ──
  'events.cleanup.gallery[0]': 'events/Departmental Cleanup_/IMG-20251228-WA0034.jpg',
  'events.cleanup.gallery[1]': 'events/Departmental Cleanup_/IMG-20260414-WA0052(1).jpg',
  'events.cleanup.gallery[2]': 'events/Departmental Cleanup_/IMG-20260806-WA0003.jpg',

  // ── Events: HIV Testing ──
  'events.hivTesting.gallery[0]': 'events/Free HIV Testing Outreach/IMG-20251127-WA0025.jpg',
  'events.hivTesting.gallery[1]': 'events/Free HIV Testing Outreach/IMG-20251203-WA0214.jpg',
  'events.hivTesting.gallery[2]': 'events/Free HIV Testing Outreach/IMG-20251203-WA0215.jpg',
  'events.hivTesting.gallery[3]': 'events/Free HIV Testing Outreach/IMG-20251203-WA0216.jpg',
  'events.hivTesting.gallery[4]': 'events/Free HIV Testing Outreach/IMG-20251203-WA0217.jpg',
  'events.hivTesting.gallery[5]': 'events/Free HIV Testing Outreach/IMG-20251203-WA0220.jpg',

  // ── Events: Fresher Orientation ──
  'events.fresherOrientation.gallery[0]': 'events/Fresher Orientation_/IMG-20251110-WA0028.jpg',
  'events.fresherOrientation.gallery[1]': 'events/Fresher Orientation_/IMG-20251126-WA0033.jpg',
  'events.fresherOrientation.gallery[2]': 'events/Fresher Orientation_/IMG-20251127-WA0038.jpg',
  'events.fresherOrientation.gallery[3]': 'events/Fresher Orientation_/IMG-20251127-WA0045.jpg',
  'events.fresherOrientation.gallery[4]': 'events/Fresher Orientation_/IMG-20251127-WA0048.jpg',
  'events.fresherOrientation.gallery[5]': 'events/Fresher Orientation_/IMG-20251127-WA0052.jpg',

  // ── Events: Merchandise Launch ──
  'events.merchandise.gallery[0]': 'events/Merchandise_/IMG-20260314-WA0034.jpg',
  'events.merchandise.gallery[1]': 'events/Merchandise_/IMG-20260401-WA0035.jpg',
  'events.merchandise.gallery[2]': 'events/Merchandise_/IMG_0321 (2).jpg',
  'events.merchandise.gallery[3]': 'events/Merchandise_/IMG_0404 (1).jpg',
  'events.merchandise.gallery[4]': 'events/Merchandise_/IMG_0405.jpg',
  'events.merchandise.gallery[5]': 'events/Merchandise_/IMG_20260522_135530_693.jpg',
  'events.merchandise.gallery[6]': 'events/Merchandise_/IMG_20260522_135627_139.jpg',
  'events.merchandise.gallery[7]': 'events/Merchandise_/bottle 2.png',
  'events.merchandise.gallery[8]': 'events/Merchandise_/bottle.png',
  'events.merchandise.gallery[9]': 'events/Merchandise_/cap black.png',
  'events.merchandise.gallery[10]': 'events/Merchandise_/cap white.png',
  'events.merchandise.gallery[11]': 'events/Merchandise_/mug.png',
  'events.merchandise.gallery[12]': 'events/Merchandise_/pen.png',
  'events.merchandise.gallery[13]': 'events/Merchandise_/polo black.png',
  'events.merchandise.gallery[14]': 'events/Merchandise_/polo.png',
  'events.merchandise.gallery[15]': 'events/Merchandise_/shirt black.png',
  'events.merchandise.gallery[16]': 'events/Merchandise_/shirt white.png',

  // ── Events: Skill Acquisition ──
  'events.skillAcquisition.gallery[0]': 'events/Skill acquisition_/IMG-20260712-WA0067.jpg',
  'events.skillAcquisition.gallery[1]': 'events/Skill acquisition_/IMG_0345.jpg',
  'events.skillAcquisition.gallery[2]': 'events/Skill acquisition_/IMG_0354 (1).jpg',
  'events.skillAcquisition.gallery[3]': 'events/Skill acquisition_/IMG_0356 (1).jpg',
  'events.skillAcquisition.gallery[4]': 'events/Skill acquisition_/IMG_0363.jpg',
  'events.skillAcquisition.gallery[5]': 'events/Skill acquisition_/IMG_0364 (1).jpg',
  'events.skillAcquisition.gallery[6]': 'events/Skill acquisition_/IMG_0375 (1).jpg',
  'events.skillAcquisition.gallery[7]': 'events/Skill acquisition_/IMG_0380 (1).jpg',
  'events.skillAcquisition.gallery[8]': 'events/Skill acquisition_/IMG_0386 (1).jpg',
  'events.skillAcquisition.gallery[9]': 'events/Skill acquisition_/IMG_0388 (2).jpg',
  'events.skillAcquisition.gallery[10]': 'events/Skill acquisition_/IMG_0396 (2).jpg',
  'events.skillAcquisition.gallery[11]': 'events/Skill acquisition_/IMG_0408.jpg',
  'events.skillAcquisition.gallery[12]': 'events/Skill acquisition_/IMG_0410.jpg',

  // ── Events: Virtual — Anchor ──
  'events.virtual.anchor.gallery[0]': 'events/Virtual Events/AHEFSS Acnhor_/IMG-20251226-WA0031.jpg',
  'events.virtual.anchor.gallery[1]': 'events/Virtual Events/AHEFSS Acnhor_/IMG-20251226-WA0034(1).jpg',

  // ── Events: Virtual — Weyesday ──
  'events.virtual.weyesday.gallery[0]': 'events/Virtual Events/AHEFSS Weyesday/IMG-20260107-WA0000.jpg',

  // ── Events: Virtual — Finance Elevation ──
  'events.virtual.financeElevation.gallery[0]': 'events/Virtual Events/Finance Elevation Series/IMG-20251202-WA0031.jpg',
  'events.virtual.financeElevation.gallery[1]': 'events/Virtual Events/Finance Elevation Series/IMG-20260325-WA0010.jpg',

  // ── Events: Virtual — Mental Health Webinar ──
  'events.virtual.mentalHealthWebinar.gallery[0]': 'events/Virtual Events/Mental Health Webinar_/IMG-20251029-WA0001.jpg',
  'events.virtual.mentalHealthWebinar.gallery[1]': 'events/Virtual Events/Mental Health Webinar_/IMG-20251105-WA0012.jpg',
  'events.virtual.mentalHealthWebinar.gallery[2]': 'events/Virtual Events/Mental Health Webinar_/IMG-20251126-WA0191.jpg',
  'events.virtual.mentalHealthWebinar.gallery[3]': 'events/Virtual Events/Mental Health Webinar_/IMG-20260107-WA0022.jpg',

  // ── Events: Virtual — Mental Health Awareness Week ──
  'events.virtual.mentalHealthAwareness.gallery[0]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260111-WA0048.jpg',
  'events.virtual.mentalHealthAwareness.gallery[1]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260112-WA0021.jpg',
  'events.virtual.mentalHealthAwareness.gallery[2]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260113-WA0012.jpg',
  'events.virtual.mentalHealthAwareness.gallery[3]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260115-WA0012.jpg',
  'events.virtual.mentalHealthAwareness.gallery[4]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260116-WA0000.jpg',
  'events.virtual.mentalHealthAwareness.gallery[5]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260117-WA0013.jpg',
  'events.virtual.mentalHealthAwareness.gallery[6]': 'events/Virtual Events/Mental health Awareness Week_/IMG-20260118-WA0035.jpg',

  // ── Virtual Events: Orientation flyers (standalone) ──
  'events.virtual.orientationFlyer1': 'events/Virtual Events/Orientation Program.jpg',
  'events.virtual.orientationFlyer2': 'events/Virtual Events/Orientation Programme For 100-500L Students.jpg',

  // ── Projects: Department Signage ──
  'projects.deptSignage.cover': 'projects/Department sign post.jpg',
  'projects.deptSignage.gallery[0]': 'projects/Department Signage/elevate-2-1.png',
  'projects.deptSignage.gallery[1]': 'projects/Department Signage/elevate-2-2.png',
  'projects.deptSignage.gallery[2]': 'projects/Department Signage/elevate-2-3.png',
  'projects.deptSignage.gallery[3]': 'projects/Department Signage/elevate-2-4.png',
  'projects.deptSignage.gallery[4]': 'projects/Department Signage/elevate-2-5.png',
  'projects.deptSignage.gallery[5]': 'projects/Department Signage/elevate-2-6.png',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getMime(ext) {
  const e = ext.toLowerCase().replace('.', '');
  if (e === 'jpg' || e === 'jpeg') return 'image/jpeg';
  if (e === 'png') return 'image/png';
  return 'application/octet-stream';
}

async function compressImage(srcPath, destPath) {
  const ext = path.extname(srcPath).toLowerCase().replace('.', '');
  const img = sharp(srcPath);
  const meta = await img.metadata();

  // Cap max dimension at 2400px (preserves aspect ratio)
  const MAX_DIM = 2400;
  let pipeline = img;
  if ((meta.width || 0) > MAX_DIM || (meta.height || 0) > MAX_DIM) {
    pipeline = pipeline.resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true });
  }

  if (ext === 'png') {
    await pipeline.png({ compressionLevel: 8, adaptiveFiltering: true }).toFile(destPath);
  } else {
    await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(destPath);
  }
}

async function uploadToCloudinary(filePath, label) {
  const ext = path.extname(filePath).toLowerCase();
  const buf = fs.readFileSync(filePath);
  const blob = new Blob([buf], { type: getMime(ext) });
  const fd = new FormData();
  fd.append('file', blob, path.basename(filePath));
  fd.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(API_URL, { method: 'POST', body: fd });
  if (!res.ok) throw new Error(`Upload failed for ${label}: ${await res.text()}`);
  const data = await res.json();
  return data.secure_url;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  // Setup temp dir
  if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

  const manifest = {};
  let done = 0;
  const total = Object.keys(ASSET_MAP).length;

  for (const [key, relPath] of Object.entries(ASSET_MAP)) {
    const srcPath = path.join(ASSETS_ROOT, relPath);

    if (!fs.existsSync(srcPath)) {
      console.warn(`[SKIP] Not found: ${srcPath}`);
      manifest[key] = null;
      continue;
    }

    const ext = path.extname(relPath);
    const safeId = key.replace(/[\[\].]/g, '_').replace(/__+/g, '_');
    const destPath = path.join(TEMP_DIR, `${safeId}${ext}`);

    try {
      // 1. Compress
      process.stdout.write(`[${++done}/${total}] Compressing: ${path.basename(relPath)} ... `);
      await compressImage(srcPath, destPath);
      const origKB = Math.round(fs.statSync(srcPath).size / 1024);
      const compKB = Math.round(fs.statSync(destPath).size / 1024);
      process.stdout.write(`${origKB}KB → ${compKB}KB | Uploading ... `);

      // 2. Upload
      const url = await uploadToCloudinary(destPath, key);
      manifest[key] = url;
      console.log(`✓`);
    } catch (err) {
      console.error(`✗ ${err.message}`);
      manifest[key] = null;
    }
  }

  // Save manifest
  const manifestPath = path.resolve('scratch/cloudinary_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Done! Manifest saved to scratch/cloudinary_manifest.json`);

  // Cleanup temp
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
}

main().catch(console.error);
