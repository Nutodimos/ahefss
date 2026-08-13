/**
 * Cloudinary Media Pipeline Helper
 * Auto-compresses images to WebP/AVIF format, caps headshots to 800px width,
 * event/gallery images to 1920px width, and provides responsive Cloudinary image URLs.
 */

// Embedded bulletproof SVG fallback image (Gold & Deep Green AHEFSS theme)
export const FALLBACK_IMAGE_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%231A4D2E"/%3E%3Ccircle cx="400" cy="270" r="80" fill="%23C9A227" opacity="0.2"/%3E%3Cpath d="M400 210 L440 310 L360 310 Z" fill="%23C9A227"/%3E%3Ctext x="400" y="420" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="%23C9A227" text-anchor="middle"%3EAHEFSS ARCHIVAL%3C/text%3E%3Ctext x="400" y="460" font-family="sans-serif" font-size="16" fill="%23FDFDF8" text-anchor="middle"%3EAssociation Media Archive%3C/text%3E%3C/svg%3E';

export function getOptimizedImageUrl(
  url: string | undefined | null,
  options: {
    width?: number;
    type?: 'headshot' | 'gallery' | 'banner';
    quality?: 'auto' | 'good' | 'best';
  } = {}
): string {
  if (!url) return FALLBACK_IMAGE_URL;

  // If local asset or non-cloudinary URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }

  const { type = 'gallery', quality = 'auto' } = options;
  const maxWidth = options.width || (type === 'headshot' ? 800 : 1920);

  const transformations = [
    'f_auto',
    `q_${quality}`,
    `w_${maxWidth}`,
    'c_limit',
  ].join(',');

  // Insert transformations into Cloudinary URL path
  return url.replace('/upload/', `/upload/${transformations}/`);
}

/**
 * BlurHash placeholder string generator or SVG Blur data URL generator
 * for smooth image loading state.
 */
export const DEFAULT_BLUR_DATA_URL =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 5"%3E%3Cfilter id="b" filterUnits="userSpaceOnUse"%3E%3CfeGaussianBlur stdDeviation="2"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" fill="%231A4D2E" opacity="0.15" filter="url(%23b)"/%3E%3C/svg%3E';
