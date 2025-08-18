# 카카오맵 API 설정 가이드

## 1. 카카오 개발자 계정 생성
1. [카카오 개발자 사이트](https://developers.kakao.com) 접속
2. 로그인 또는 회원가입

## 2. 애플리케이션 생성
1. "내 애플리케이션" 메뉴 클릭
2. "애플리케이션 추가하기" 클릭
3. 앱 이름, 사업자명 입력 후 저장

## 3. JavaScript 키 발급
1. 생성된 애플리케이션 클릭
2. "앱 키" 메뉴에서 "JavaScript 키" 복사

## 4. 플랫폼 등록
1. "플랫폼" 메뉴 클릭
2. "Web 플랫폼 등록" 클릭
3. 사이트 도메인 추가:
   - 개발용: http://localhost:3000
   - 운영용: 실제 도메인 주소
4. 저장

## 5. 프로젝트 설정
1. `.env.local` 파일 열기
2. `YOUR_KAKAO_APP_KEY_HERE` 부분을 발급받은 JavaScript 키로 교체
   ```
   NEXT_PUBLIC_KAKAO_MAP_KEY=발급받은_JavaScript_키
   ```

## 6. 실행 확인
```bash
npm run dev
```

## 주의사항
- JavaScript 키는 외부에 노출되지 않도록 주의
- `.env.local` 파일은 `.gitignore`에 포함되어야 함
- 운영 배포 시 환경 변수 설정 필요