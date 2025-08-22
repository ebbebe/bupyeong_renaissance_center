import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const filePath = formData.get('filePath') as string;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    if (!filePath) {
      return NextResponse.json(
        { error: '파일 경로가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase Storage에 업로드
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true // 같은 이름 파일이 있으면 덮어쓰기
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return NextResponse.json(
        { error: '파일 업로드에 실패했습니다.' },
        { status: 500 }
      );
    }

    // 공개 URL 생성
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}