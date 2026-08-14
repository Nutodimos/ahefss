# AHEFSS Asset Management Guide

> **Quick rule:** Every image used in the project must be on Cloudinary. Local files in `public/assets/` are only a staging area before upload.

---

## Folder Structure

```
public/assets/
│
├── brand/
│   ├── Logo.jpg                 ← Association logo (favicon, footer, navbar)
│   └── Administration logo.jpg  ← Session/administration logo (pioneer badge etc.)
│
├── executives/
│   ├── President Abdulwarees_.jpg
│   ├── Vice president.jpg
│   └── meet your executive flyer.jpg
│   (Add new photos here as: [firstname-lastname].jpg)
│
├── events/
│   ├── AHEFSS HOD_s Cup/
│   ├── Departmental Cleanup_/
│   ├── Free HIV Testing Outreach/
│   ├── Fresher Orientation_/
│   ├── Merchandise_/
│   ├── Skill acquisition_/
│   └── Virtual Events/
│       ├── AHEFSS Acnhor_/
│       ├── AHEFSS Weyesday/
│       ├── Finance Elevation Series/
│       ├── Mental Health Webinar_/
│       └── Mental health Awareness Week_/
│
└── projects/
    ├── Department sign post.jpg
    └── Department Signage/
```

---

## Workflow: Adding New Assets

### Step 1 — Drop files in the right folder
Place images in the correct `public/assets/` subfolder.

- **New executive photo** → `public/assets/executives/[firstname-lastname].jpg`  
- **New event photos** → `public/assets/events/[Event Name]/`  
- **New project photos** → `public/assets/projects/[Project Name]/`

> **File naming tips:**
> - Prefer lowercase with hyphens: `sport-director.jpg`
> - Avoid special characters `( ) & '` in filenames — they cause upload issues
> - JPG for photos, PNG only for transparent/design assets (logos, flyers)

---

### Step 2 — Register the asset in the upload script

Open `scratch/compress-and-upload.mjs` and add your new file to the `ASSET_MAP` object:

```js
// Example: adding a new executive
'executives.sportsDirector': 'executives/sport-director.jpg',

// Example: adding a new event
'events.newEvent.gallery[0]': 'events/New Event Name/photo1.jpg',
'events.newEvent.gallery[1]': 'events/New Event Name/photo2.jpg',
```

---

### Step 3 — Run the upload script

```bash
cd ahefss
node scratch/compress-and-upload.mjs
```

This will:
1. **Compress** each image with Sharp (JPEG 80%, PNG level 8, max 2400px)
2. **Upload** to your Cloudinary account (`q9jb9wvk`, preset `ahefss_uploads`)
3. **Save** a manifest of all URLs to `scratch/cloudinary_manifest.json`

---

### Step 4 — Update `lib/assets.ts`

Open `scratch/cloudinary_manifest.json` and copy the URLs into `lib/assets.ts`:

```ts
// Before:
'executives.sportsDirector': null,  // Photo pending

// After:
export const EXEC_PHOTOS = {
  ...
  sportsDirector: 'https://res.cloudinary.com/q9jb9wvk/image/upload/v.../filename.jpg',
};
```

---

### Step 5 — Update mock data (if adding a new event/executive)

If you added a **new executive with a photo**, update `lib/supabase.ts`:
```ts
{
  id: 'exec-8',
  full_name: 'Sports Director Name',
  office_position: 'Sports Director',
  photo_url: EXEC_PHOTOS.sportsDirector,  // ← use the asset constant
  ...
}
```

If you added a **new event**, add an entry in `MOCK_EVENTS`:
```ts
{
  id: 'event-new',
  title: 'New Event Name',
  flyer_banner_url: EVENT_NEW.flyer,
  photo_gallery: EVENT_NEW.gallery,
  ...
}
```

---

## Placeholder Policy

When an image isn't available yet, use `null` as the value:
```ts
sportsDirector: null,   // Photo pending
```

The `getOptimizedImageUrl()` function in `lib/cloudinary.ts` automatically shows the **AHEFSS branded fallback SVG** whenever it receives `null` or `undefined`. No broken images — ever.

---

## Cloudinary Settings

| Setting | Value |
|---|---|
| Cloud Name | `q9jb9wvk` |
| Upload Preset | `ahefss_uploads` (unsigned) |
| Target Folder | `ahefss` (set in Cloudinary dashboard) |
| Auto-format | `f_auto` (AVIF/WebP served based on browser) |
| Auto-quality | `q_auto` (smart compression on delivery) |

All transformations are handled by `getOptimizedImageUrl()` in `lib/cloudinary.ts` — you don't need to manually edit Cloudinary URLs.

---

## Quick Cheat Sheet

| Task | File to edit |
|---|---|
| Add/update image URL | `lib/assets.ts` |
| Add a new event to the site | `lib/supabase.ts` → `MOCK_EVENTS` |
| Add a new executive | `lib/supabase.ts` → `MOCK_EXECUTIVE_MEMBERS` |
| Upload & compress new images | `node scratch/compress-and-upload.mjs` |
| Register new asset in upload script | `scratch/compress-and-upload.mjs` → `ASSET_MAP` |
