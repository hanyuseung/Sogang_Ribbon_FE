# 2026-06-10 변경사항 (feat/admin)

## 1. Admin 식당 관리 기능 (추가 / 수정 / 삭제)

`user.role === "admin"`인 사용자만 place를 추가·수정·삭제할 수 있는 관리 기능.

### 권한 처리
- `types/user.ts` — `role: string | null` 추가. `null` = DB 프로필(/api/me) 응답 전.
- `app/api/me/route.ts` — `role` 반환 추가.
- `contexts/AuthContext.tsx` — 초기엔 `role: null`로 두고 `/api/me` 응답으로 보강. 실패 시 `"user"` 폴백.
- `lib/admin-auth.ts` (신규) — `getAdminUserId(req)`: Bearer 토큰 → Supabase 검증 → Prisma에서 `role === "admin"` 확인. **실제 보안은 API에서 강제, 클라이언트 가드는 UX용.**

### API (모두 admin 전용, 아니면 403)
- `GET/POST /api/admin/places` — 목록(캐시 미사용·fresh)/생성
- `GET/PUT/DELETE /api/admin/places/[id]` — 단건 조회/수정/삭제
- `POST /api/admin/upload` — 이미지 업로드 (아래 3번)
- 쓰기 후 `revalidateTag("places", { expire: 0 })`로 공개 페이지 캐시 즉시 무효화.
  Next 16에서 단일 인자 `revalidateTag(tag)`는 deprecated — 두 인자 시그니처 필수.
- 입력 검증: `lib/place-input.ts`의 `parsePlaceInput()` — `name` 필수, 나머지 string/number → null 정규화.
- 삭제는 FK 참조(`place_bookmark`, `award_res`)를 트랜잭션으로 먼저 지움 (`services/place.ts`의 `deletePlace`).

### services/place.ts 추가 함수
`getPlacesFresh`, `getPlaceByIdFresh`(관리 화면용 비캐시), `createPlace`, `updatePlace`, `deletePlace`, `toPrismaData`(snake_case `PlaceInput` → Prisma camelCase 매핑).

### UI (기존 핑크 테마 #fff8fb / #d6336c / #f3d5df 유지)
- `/admin/places` — 관리 목록 + "식당 추가" 버튼
- `/admin/places/new`, `/admin/places/[id]/edit` — 공용 `components/AdminPlaceForm.tsx`
- `components/AdminGuard.tsx` — admin 아니면 차단. `role === null` 동안 로딩 표시(권한 없음 깜빡임 방지)
- 마이페이지(`app/mypage/page.tsx`)에 admin 전용 "식당 관리" 메뉴
- 삭제 버튼은 수정 모드에만 표시, 2단계 확인(한 번 더 누르면 삭제 + 취소 버튼)

## 2. DB 커넥션 타임아웃 수정 (`lib/prisma.ts`)

식당 추가 시 500 원인 = Supabase pooler 콜드 커넥션 수립이 ~5초인데 타임아웃이 정확히 5초였음.
- `connectionTimeoutMillis`: 5초 → **15초**, `idleTimeoutMillis`: 5초 → **30초**
- 주의: dev에서 Prisma 클라이언트가 `globalThis`에 캐시되므로 **설정 변경은 dev 서버 재시작해야 적용됨**.
- 에러 시그니처: `⨯ Error: Connection terminated due to connection timeout` (로그: `.next/dev/logs/next-development.log`)

## 3. 이미지 직접 업로드 (Supabase Storage)

- `lib/image-webp.ts` (신규) — 브라우저에서 canvas로 webp 변환. 본문 최대 1200px(q 0.8), 썸네일 160×160 중앙 크롭(q 0.75).
- `POST /api/admin/upload` (신규) — `SUPABASE_SECRET_KEY`(service role)로 `place_img` 버킷에 업로드 → **RLS 정책 추가 불필요**. 같은 UUID로 `places/<id>.webp` + `thumbnail/<id>.webp` 생성(기존 경로 규칙 유지), webp 타입·크기(5MB/1MB) 검증, 썸네일 실패 시 본문 롤백 삭제.
- `AdminPlaceForm` — 파일 선택 → 미리보기 → 저장 시 변환·업로드 → 반환 URL을 `img_url`/`thumbnail_url`에 반영. URL 텍스트 입력은 수동 fallback으로 유지.
- place 삭제 시 Storage 파일은 지우지 않음(의도된 동작).

## 4. 맵 검색창 한글 IME 깨짐 수정 (`components/MapSection.tsx`)

증상: 검색창에 한글 입력 시 `ㅁㅣㄹㅍㅡㄹ`처럼 자모 분리.
원인: input `value`가 `useSearchParams()` 직결 → 키 입력마다 `history.replaceState` → 라우터 상태 **비동기** 갱신이 IME 조합을 끊음.
수정: input은 로컬 state(`searchInput`)로 즉시 제어, URL은 뒤에서 따라감. 외부 URL 변경(뒤로가기 등) 동기화는 ESLint `react-hooks/set-state-in-effect` 때문에 effect 대신 **렌더 중 상태 보정 패턴**(`prevSearchQuery` 비교) 사용. 필터링은 여전히 URL의 `search` 파라미터 기준(공유/새로고침 유지).

## 검증 상태
- `npm run lint`, `npm run build` 통과
- Storage 업로드/삭제, place 생성/삭제 트랜잭션 DB 실측 확인완료
- `/api/admin/upload` 무토큰·잘못된 토큰 403 확인
- admin 계정으로 실제 업로드 E2E, 한글 IME 실입력 확인완료
