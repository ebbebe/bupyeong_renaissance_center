// 이미지 업로드 관련 유틸리티 함수들

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// 이미지 파일 검증
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'JPG, PNG, WebP 파일만 업로드 가능합니다.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: '파일 크기는 5MB 이하여야 합니다.' };
  }
  
  return { valid: true };
};

// 이미지를 Supabase Storage에 저장
export const uploadImageToSupabase = async (file: File, folder: string = 'stories'): Promise<UploadResult> => {
  try {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // 파일명 생성 (타임스탬프 + 랜덤 문자열)
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;
    const filePath = `${folder}/${fileName}`;

    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filePath', filePath);

    // 업로드 API 호출
    const response = await fetch('/api/upload/supabase', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || '업로드 중 오류가 발생했습니다.' };
    }

    const result = await response.json();
    return { success: true, url: result.url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: '업로드 중 오류가 발생했습니다.' };
  }
};

// 기존 함수는 레거시 지원용으로 유지
export const uploadImageToPublic = uploadImageToSupabase;

// Base64로 이미지 미리보기 생성
export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};