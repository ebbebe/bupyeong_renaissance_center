import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // admin 경로 보호
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // admin 메인 페이지는 패스 (로그인 처리)
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }

    // 쿠키나 헤더로 인증 확인 (클라이언트 사이드에서 localStorage 체크)
    // 여기서는 기본적인 보호만 제공
    const url = request.nextUrl.clone();
    
    // Referer 체크 (최소한의 보호)
    const referer = request.headers.get('referer');
    if (!referer || !referer.includes('/admin')) {
      // admin 페이지에서 온 것이 아니면 리다이렉트
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};