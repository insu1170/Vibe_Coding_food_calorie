# AI 식단 관리 서비스 프로토타입

## 프로젝트 개요

**"마찰 없는 기록(Frictionless Logging)"** 철학을 기반으로 한 AI 식단 관리 서비스의 MVP/프로토타입 버전입니다.

사용자는 단 하나의 버튼을 눌러 음식 사진을 선택하는 것만으로 식단 기록의 모든 과정을 완료할 수 있습니다. 끼니 선택과 같은 부가적인 사용자 입력은 완전히 배제하고, 업로드 시각을 기준으로 끼니를 자동으로 분별합니다.

## 주요 기능

### ✅ 핵심 기능 (현재 개발 중)
- **원클릭 식단 기록**: 사진 선택만으로 자동 분석 및 저장
- **시간 기반 자동 분류**: 업로드 시각에 따른 아침/점심/저녁/간식 자동 분류
- **AI 식품 분석**: 이미지에서 음식 인식 및 영양 정보 분석
- **끼니별 대시보드**: 날짜별, 끼니별로 정리된 식단 조회

### 🎯 사용자 경험
- ✅ **매력적인 랜딩페이지**: 제품 철학과 기능 소개 (완료)
- ✅ **반응형 디자인**: 모든 기기에서 완벽한 경험 (완료)
- **Supabase 인증**: 이메일 기반 회원가입 및 로그인 (개발 중)
- **모바일 최적화**: 반응형 디자인 및 터치 친화적 UI (완료)
- **실시간 피드백**: 로딩 상태 및 진행 상황 표시 (개발 중)
- **에러 복구**: 자동 재시도 및 사용자 친화적 에러 메시지 (개발 중)

## 기술 스택

### Frontend
- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**

### Backend & Infrastructure
- **Supabase**: 인증, 데이터베이스, 스토리지
- **n8n**: 자동화 워크플로우 (웹훅, AI 연동)
- **외부 AI 서비스**: 식품 분석 API

## 프로젝트 구조

```
📁 docs/                    # 프로젝트 문서
  ├── PRD.md               # 제품 요구사항 문서
  ├── TASKS.md             # 전체 Task 개요
  ├── TASKS-DETAIL-PHASE1.md # Phase 1 상세 Task
  ├── TASKS-DETAIL-PHASE2.md # Phase 2 상세 Task
  ├── TASKS-DETAIL-PHASE3.md # Phase 3 상세 Task
  ├── TASKS-DETAIL-PHASE4.md # Phase 4 상세 Task
  ├── TASKS-DETAIL-PHASE5.md # Phase 5 상세 Task
  └── TASKS-DETAIL-PHASE6-7.md # Phase 6-7 상세 Task

📁 app/                     # Next.js App Router
  ├── actions/             # Server Actions
  ├── auth/                # 인증 관련 페이지
  ├── meals/               # 식단 관련 페이지
  └── ...

📁 components/              # React 컴포넌트
  ├── auth/                # 인증 컴포넌트
  ├── meals/               # 식단 컴포넌트
  └── ...

📁 lib/                     # 유틸리티 함수
  ├── supabase/            # Supabase 클라이언트
  ├── n8n/                 # n8n 연동 함수
  └── ...

📁 types/                   # TypeScript 타입 정의
```

## 개발 단계별 가이드

### 🚀 Phase 1: 프로젝트 기초 설정 (완료 ✅)
1. ✅ **환경 설정**: Next.js App Router 기반 프로젝트 설정 완료
2. **데이터베이스**: Supabase 테이블 및 RLS 설정 (진행 중)
3. **Storage**: 이미지 저장용 버킷 설정 (진행 중)

📋 **[Phase 1 상세 Task 보기](TASKS-DETAIL-PHASE1.md)**

### 🔐 Phase 2: 사용자 인증 시스템 (진행 중)
1. **Supabase Auth 연동**: 클라이언트 및 서버 설정
2. **인증 UI**: 로그인/회원가입 페이지 구현
3. **보호된 라우트**: 미들웨어 및 인증 가드

📋 **[Phase 2 상세 Task 보기](TASKS-DETAIL-PHASE2.md)**

### 🔄 Phase 3: n8n 웹훅 연동 (진행 중)
1. **웹훅 설정**: n8n 워크플로우 구성
2. **API 연동**: Next.js에서 n8n으로 이미지 업로드
3. **에러 처리**: 재시도 로직 및 응답 처리

📋 **[Phase 3 상세 Task 보기](TASKS-DETAIL-PHASE3.md)**

### 🤖 Phase 4: n8n 자동화 워크플로우 (진행 중)
1. **시간 기반 분류**: 4개 끼니 자동 분별
2. **AI 분석**: 외부 식품 분석 서비스 연동
3. **Supabase 저장**: 트랜잭션 처리 및 롤백

📋 **[Phase 4 상세 Task 보기](TASKS-DETAIL-PHASE4.md)**

### 📱 Phase 5: 사용자 인터페이스
#### 5.1 랜딩페이지 (완료 ✅)
1. ✅ **MealLog 랜딩페이지**: 매력적이고 직관적인 제품 소개 페이지 완성
2. ✅ **Hero 섹션**: 강력한 가치 제안과 CTA 버튼 구현
3. ✅ **Features 섹션**: 6개 핵심 기능 카드로 시각화
4. ✅ **How It Works 섹션**: 3단계 사용법 안내
5. ✅ **반응형 디자인**: 모든 기기에서 완벽한 호환성

#### 5.2 식단 기록 페이지 (진행 중)
1. **식단 업로드**: 드래그 앤 드롭, 카메라 지원
2. **대시보드**: 끼니별 그룹화 및 상세 조회
3. **일일 요약**: 총 칼로리 및 영양 정보

📋 **[Phase 5 상세 Task 보기](TASKS-DETAIL-PHASE5.md)**

### 🎨 Phase 6-7: UI/UX 개선 및 품질 보증
#### 6.1 모바일 응답형 디자인 (완료 ✅)
1. ✅ **반응형 레이아웃**: 모바일 최적화 CSS 및 레이아웃 구현
2. ✅ **터치 친화적 UI**: 44px 이상 터치 타겟 및 모바일 네비게이션
3. ✅ **사용자 경험 최적화**: 로딩 애니메이션, 색상 팔레트, 접근성 개선

#### 6.2 품질 보증 (진행 중)
1. **테스트**: 단위 테스트 및 E2E 테스트
2. **에러 핸들링**: 전역 에러 처리 및 사용자 친화적 메시지

📋 **[Phase 6-7 상세 Task 보기](TASKS-DETAIL-PHASE6-7.md)**

## 현재 상태

### ✅ 완료된 작업
- **Next.js 프로젝트 구조 최적화**: App Router 기반 프로젝트 설정 완료
- **매력적인 랜딩페이지**: 제품 철학과 기능 소개 페이지 완성
- **반응형 디자인**: 모바일 최적화 및 접근성 개선 완료
- **TypeScript 설정**: 타입 안전성을 위한 기본 설정 완료

### 🚧 진행 중인 작업
- Supabase 인증 및 데이터베이스 설정
- n8n 자동화 워크플로우 구성
- 실제 식단 기록 기능 개발

### 📋 현재 실행 중인 서버
```bash
# 개발 서버 실행 (포트 3001)
npm run dev
# 서버 URL: http://localhost:3001
```

## 시작하기

### 1. 환경 설정 (아직 미완료)
```bash
# 패키지 설치 (이미 완료됨)
npm install

# 환경 변수 설정 (.env.local)
cp .env.example .env.local
# 다음 값들을 설정하세요:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - N8N_WEBHOOK_URL
```

### 2. Supabase 설정 (아직 미완료)
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 인증 활성화 (이메일 인증)
3. 다음 SQL 실행:
```sql
-- food_logs 테이블 생성
CREATE TABLE food_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('아침', '점심', '저녁', '간식')),
  image_url TEXT NOT NULL,
  items JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_food_logs_user_id ON food_logs(user_id);
CREATE INDEX idx_food_logs_created_at ON food_logs(created_at);
CREATE INDEX idx_food_logs_meal_type ON food_logs(meal_type);

-- RLS 정책 설정
ALTER TABLE food_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own food logs"
  ON food_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own food logs"
  ON food_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own food logs"
  ON food_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own food logs"
  ON food_logs FOR DELETE
  USING (auth.uid() = user_id);
```

4. Storage 버킷 생성:
   - 이름: `meal-images`
   - 공개: true (또는 인증된 사용자만)

### 3. n8n 워크플로우 설정 (아직 미완료)
1. [n8n](https://n8n.io)에서 새 워크플로우 생성
2. Webhook 트리거 설정:
   - Method: POST
   - Path: `/api/meal-analysis`
   - Content-Type: `multipart/form-data`
3. 시간 기반 분류, AI 분석, Supabase 저장 노드 연결

## 성공 기준

- ✅ 사용자가 사진 한 장으로 식단 기록 완료
- ✅ 시간 기반 자동 끼니 분류 동작
- ✅ Supabase에 데이터 정상 저장
- ✅ 대시보드에서 기록 조회 가능
- ✅ 모바일에서 정상 동작

## Server Actions 명세

### 식단 업로드 Server Action
```typescript
// app/actions/upload-meal.ts
'use server'

import { uploadMealImage } from '@/lib/meal-upload'

export async function uploadMealAction(formData: FormData) {
  const image = formData.get('image') as File

  if (!image) {
    throw new Error('이미지 파일이 필요합니다.')
  }

  return await uploadMealImage(image)
}
```

### 식단 조회 Server Action
```typescript
// app/actions/get-meals.ts
'use server'

import { getMealsByDate } from '@/lib/meal-queries'

export async function getMealsAction(date: string) {
  return await getMealsByDate(date)
}
```

### 사용자 인증 Server Actions
```typescript
// app/actions/auth.ts
'use server'

import { signIn, signUp } from '@/lib/auth'

export async function signInAction(email: string, password: string) {
  return await signIn(email, password)
}

export async function signUpAction(email: string, password: string) {
  return await signUp(email, password)
}
```

## 에러 처리

### 성공 응답
```json
{
  "success": true,
  "data": {
    "items": [...],
    "summary": {
      "totalCalories": 1040,
      "totalCarbohydrates": 86.8,
      "totalProtein": 51.8,
      "totalFat": 49.9
    }
  }
}
```

### 실패 응답
```json
{
  "success": false,
  "error": {
    "code": "NO_FOOD_DETECTED",
    "message": "이미지에서 음식을 찾을 수 없습니다."
  }
}
```

## 배포

### 개발 환경 (현재 실행 중)
```bash
# 개발 서버 실행
npm run dev
# 현재 서버: http://localhost:3001 (포트 3000 사용 중)
```

### 프로덕션 빌드 (준비 중)
```bash
# 프로덕션 빌드
npm run build
npm start
```

### 환경 변수 (프로덕션)
- Vercel 자동 배포 시 환경 변수 설정 필요
- Supabase, n8n 연결 정보 구성
- 현재는 개발 환경에서만 랜딩페이지 테스트 가능

## 참고 자료

- [PRD 문서](docs/PRD.md)
- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Next.js Server Actions 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Supabase 문서](https://supabase.com/docs)
- [Supabase SSR 문서](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [n8n 문서](https://docs.n8n.io)

## 라이선스

이 프로젝트는 학습 및 프로토타입 목적으로 개발되었습니다.
