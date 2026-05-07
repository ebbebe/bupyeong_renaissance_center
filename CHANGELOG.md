# CHANGELOG

## 2026-05-07 — 변경 이력 조회 화면 추가

### 변경 내용
관리자 페이지에 "변경 이력" 메뉴 추가. 4종 콘텐츠 변경 기록을 통합 조회.
- server route(`/api/admin/audit-logs`)에서 `SUPABASE_SERVICE_ROLE_KEY`로 조회 → anon에게 audit_logs를 노출하지 않음
- `x-admin-key` 헤더로 관리자 인증 게이트 (값은 기존 비밀번호 동일)
- 필터: 항목(테이블)·작업·날짜 범위 / 페이지네이션 50건씩
- 상세 모달: UPDATE는 변경된 컬럼만 전·후 비교 / INSERT·DELETE는 전체 JSON

### 영향받는 파일
- 신규: [lib/admin-auth.ts](lib/admin-auth.ts), [lib/supabase-admin.ts](lib/supabase-admin.ts)
- 신규: [app/api/admin/audit-logs/route.ts](app/api/admin/audit-logs/route.ts)
- 신규: [app/admin/audit-logs/page.tsx](app/admin/audit-logs/page.tsx)
- 수정: [app/admin/page.tsx](app/admin/page.tsx) — ADMIN_KEY를 lib로 이전 + 메뉴 카드 추가

### 필수 환경 변수
`.env.local`에 다음 추가 필요. 없으면 변경 이력 화면이 500 응답.
```
SUPABASE_SERVICE_ROLE_KEY=<Supabase 대시보드 → Project Settings → API → service_role secret>
```
주의: `NEXT_PUBLIC_` 접두사 없이 둘 것. 클라이언트로 노출되면 안 됨.

### 주의사항
- service_role 키는 RLS를 우회하므로 server route 외부로 절대 새지 않게. 현재 코드는 [lib/supabase-admin.ts](lib/supabase-admin.ts)에서만 사용.
- 인증 헤더 값(`bupyeong2024`)이 기존대로 클라이언트 코드에 노출. 본 작업 범위 밖.
- 페이지 크기 상한 200건. 그 이상 요청 들어와도 200으로 클램프.

---

## 2026-05-07 — 변경 이력(audit log) 시스템 추가

### 변경 내용
관리 콘텐츠 4종(`stories`, `events`, `event_info`, `stamps`)에 대한 모든
INSERT/UPDATE/DELETE를 PostgreSQL 트리거가 `public.audit_logs`에 자동 적재.
앱 코드 변경 없음. 변경 전/후 행 전체를 JSONB로 저장.

### 영향받는 테이블
- 신규: `public.audit_logs` (id, table_name, row_id, action, old_data, new_data, actor, changed_at)
- 트리거 부착: `public.stories`, `public.events`, `public.event_info`, `public.stamps`
- 신규 함수: `public.log_audit_event()` (SECURITY DEFINER)

### 영향받는 마이그레이션
- `20260507062937_add_audit_logs`
- `20260507062946_lock_down_audit_logs_rls`

### 주의사항 / 한계
- **"누가 했는지"는 기록되지 않음.** 관리자 인증이 공용 비밀번호 1개([app/admin/page.tsx:6](app/admin/page.tsx#L6))라 모든 작업이 `actor='admin'`으로만 찍힘. 담당자별 추적이 필요하면 관리자 로그인 시스템부터 도입해야 함.
- **이력 조회 화면은 만들지 않음.** 필요 시 service_role로 직접 조회: `SELECT * FROM audit_logs WHERE table_name='events' ORDER BY changed_at DESC;`
- **append-only.** anon/authenticated는 `audit_logs`에 SELECT/INSERT/UPDATE/DELETE 모두 불가. 트리거 함수만 SECURITY DEFINER로 INSERT 가능.
- **보존 기간 무기한.** 행 수가 부담될 시점이 오면 `changed_at` 기준 파티셔닝/아카이빙 필요.
- **별개 이슈로 발견:** anon 키만으로 `events`(아마도 다른 콘텐츠 테이블도) UPDATE가 통과함. 즉 누구나 supabase-js로 직접 콘텐츠를 변경할 수 있는 상태. audit는 그래도 남지만, 차단하려면 RLS 정책을 admin write 차단 + 서버 route로 옮기는 작업이 필요. 본 작업 범위 밖.

### 검증
- `events`에 service_role / anon 각각으로 self-update 1회씩 → `audit_logs` id 1, 2 적재 확인
- anon으로 `SELECT FROM audit_logs` 시도 → `permission denied` 정상 차단
