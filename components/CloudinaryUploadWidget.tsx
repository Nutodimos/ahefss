'use client';

import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, Upload, X } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  multiple?: boolean;
  onMultipleChange?: (urls: string[]) => void;
}

export default function CloudinaryUploadWidget({
  value,
  onChange,
  label = 'Upload Image',
  multiple = false,
  onMultipleChange,
}: CloudinaryUploadWidgetProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  // Cloudinary Cloud Name & Unsigned Preset
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

      if (multiple && onMultipleChange) {
        onMultipleChange(uploadedUrls);
      } else if (uploadedUrls.length > 0) {
        setPreviewUrl(uploadedUrls[0]);
        onChange(uploadedUrls[0]);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        
        {/* Preview Thumbnail */}
        {previewUrl && !multiple && (
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-300 flex-shrink-0 bg-gray-50">
            <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
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
                <span>{multiple ? 'Choose Gallery Photos (Multiple)' : 'Choose Image File'}</span>
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
      <div className="pt-1">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setPreviewUrl(e.target.value);
            onChange(e.target.value);
          }}
          placeholder="Or paste Cloudinary image URL..."
          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#1A4D2E]"
        />
      </div>
    </div>
  );
}
