"use client";

import { useState, useRef } from 'react';
import { uploadImageToPublic, createImagePreview } from '@/lib/upload';

interface MultiImageUploadProps {
  currentImages?: string[];
  onImagesChange: (images: string[]) => void;
  folder?: string;
  label?: string;
  maxImages?: number;
  className?: string;
}

export default function MultiImageUpload({ 
  currentImages = [], 
  onImagesChange, 
  folder = 'stories',
  label = '추가 이미지',
  maxImages = 10,
  className = ''
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(currentImages);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`최대 ${maxImages}개의 이미지만 업로드 가능합니다.`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    try {
      setUploading(true);
      const uploadPromises = filesToUpload.map(async (file) => {
        const result = await uploadImageToPublic(file, folder);
        if (result.success && result.url) {
          return result.url;
        }
        throw new Error(result.error || '업로드 실패');
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onImagesChange(newImages);
      
    } catch (error) {
      console.error('File upload error:', error);
      alert('일부 파일 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= images.length) return;
    
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
    onImagesChange(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({images.length}/{maxImages})
      </label>
      
      <div className="space-y-4">
        {/* 업로드 버튼 */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={uploading || images.length >= maxImages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? '업로드 중...' : '이미지 추가'}
          </button>
          
          {images.length >= maxImages && (
            <span className="text-sm text-gray-500">
              최대 개수에 도달했습니다
            </span>
          )}
        </div>

        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* 이미지 목록 */}
        {images.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">업로드된 이미지:</p>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {images.map((imageUrl, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={`이미지 ${index + 1}`}
                      className="w-20 h-16 object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg width="80" height="64" viewBox="0 0 80 64" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="64" fill="%23F3F4F6"/%3E%3Ctext x="40" y="32" text-anchor="middle" fill="%239CA4AF" font-family="Arial" font-size="10"%3E이미지 오류%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">이미지 {index + 1}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* 순서 변경 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="위로 이동"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="아래로 이동"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 text-red-600 hover:text-red-700 ml-2"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 업로드 안내 */}
        <p className="text-xs text-gray-500">
          JPG, PNG, WebP 파일을 여러 개 선택할 수 있습니다. (각 파일 최대 5MB)
        </p>
      </div>
    </div>
  );
}