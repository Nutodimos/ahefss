'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, Upload, X, Plus } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  multiple?: boolean;
  gallery?: string[];
  onGalleryChange?: (urls: string[]) => void;
  onMultipleChange?: (urls: string[]) => void;
}

export default function CloudinaryUploadWidget({
  value = '',
  onChange,
  label = 'Upload Image',
  multiple = false,
  gallery = [],
  onGalleryChange,
  onMultipleChange,
}: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned_preset';

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', uploadPreset);

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (res.ok) {
            const data = await res.json();
            uploadedUrls.push(data.secure_url);
          } else {
            console.error('Cloudinary API upload error, creating local object URL');
            uploadedUrls.push(URL.createObjectURL(file));
          }
        } else {
          uploadedUrls.push(URL.createObjectURL(file));
        }
      }

      if (multiple) {
        if (onGalleryChange) {
          onGalleryChange([...gallery, ...uploadedUrls]);
        } else if (onMultipleChange) {
          onMultipleChange(uploadedUrls);
        }
      } else if (uploadedUrls.length > 0 && onChange) {
        onChange(uploadedUrls[0]);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveFromGallery(indexToRemove: number) {
    if (onGalleryChange) {
      onGalleryChange(gallery.filter((_, idx) => idx !== indexToRemove));
    }
  }

  function handleAddManualUrl() {
    if (!manualUrl.trim()) return;
    if (multiple) {
      if (onGalleryChange) {
        onGalleryChange([...gallery, manualUrl.trim()]);
      }
      setManualUrl('');
    } else {
      if (onChange) onChange(manualUrl.trim());
      setManualUrl('');
    }
  }

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Multiple Gallery Image Thumbnails Display */}
      {multiple && gallery && gallery.length > 0 && (
        <div className="flex flex-wrap gap-2.5 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
          {gallery.map((url, idx) => (
            <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-300 bg-white shadow-sm">
              <img src={url} alt={`Gallery thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemoveFromGallery(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 group-hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Single Preview Thumbnail */}
        {!multiple && value && (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-300 flex-shrink-0 bg-gray-50">
            <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Upload Button Box */}
        <label className="flex-1 cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 hover:border-[#1A4D2E] bg-gray-50 hover:bg-[#1A4D2E]/5 rounded-xl px-4 py-3 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1A4D2E]" />
                <span>Uploading to Cloudinary...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-[#C9A227]" />
                <span>{multiple ? 'Select Gallery Photos (Multiple Supported)' : 'Choose Image File'}</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </label>
      </div>

      {/* Manual URL Input Fallback */}
      <div className="flex gap-2">
        <input
          type="text"
          value={multiple ? manualUrl : value}
          onChange={(e) => {
            if (multiple) {
              setManualUrl(e.target.value);
            } else if (onChange) {
              onChange(e.target.value);
            }
          }}
          placeholder={multiple ? "Paste image URL and click Add..." : "Or paste Cloudinary image URL..."}
          className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#1A4D2E]"
        />
        {multiple && manualUrl.trim() && (
          <button
            type="button"
            onClick={handleAddManualUrl}
            className="px-3 py-1.5 rounded-lg bg-[#1A4D2E] text-white text-xs font-bold hover:bg-[#0F3320] flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        )}
      </div>
    </div>
  );
}
