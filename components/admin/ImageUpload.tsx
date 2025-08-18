"use client";

import { useState, useRef } from 'react';
import { uploadImageToPublic, createImagePreview } from '@/lib/upload';

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  currentImageUrl, 
  onImageChange, 
  folder = 'general',
  label = '이미지',
  className = ''
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // 미리보기 생성
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);

      // 파일 업로드
      const result = await uploadImageToPublic(file, folder);
      
      if (result.success && result.url) {
        onImageChange(result.url);
        setPreview(result.url);
      } else {
        alert(result.error || '업로드 중 오류가 발생했습니다.');
        setPreview(currentImageUrl || null);
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="space-y-4">
        {/* 업로드 버튼 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '업로드 중...' : '이미지 선택'}
          </button>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-700"
            >
              제거
            </button>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 미리보기 */}
        {preview && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">미리보기:</p>
            <div className="relative inline-block">
              <img
                src={preview}
                alt="미리보기"
                className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  console.error('Image load error:', e);
                  e.currentTarget.src = '/images/placeholder.png';
                }}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 업로드 안내 */}
        <p className="text-xs text-gray-500">
          JPG, PNG, WebP 파일만 업로드 가능합니다. (최대 5MB)
        </p>
      </div>
    </div>
  );
}