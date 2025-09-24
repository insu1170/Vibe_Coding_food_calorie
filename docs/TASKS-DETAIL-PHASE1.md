# Phase 1: 프로젝트 기초 설정 - 상세 Task

## 1.1 프로젝트 구조 및 환경 설정

### 1.1.1 Next.js App Router 프로젝트 구조 최적화
- [ ] **프로젝트 구조 분석 및 문서화**
  - 현재 app 디렉토리 구조 분석
  - Server Actions 구조 설계 (/actions/auth, /actions/meals, /actions/upload 등)
  - 페이지 구조 설계 (/auth, /dashboard, /meals 등)

- [ ] **디렉토리 구조 생성 및 최적화**
  - `app/actions/auth/` - 인증 관련 Server Actions
  - `app/actions/meals/` - 식단 관련 Server Actions
  - `app/actions/upload/` - 이미지 업로드 Server Actions
  - `lib/` - 유틸리티 함수들
  - `types/` - TypeScript 타입 정의
  - `components/` - 재사용 컴포넌트들

- [ ] **기본 레이아웃 및 페이지 템플릿 생성**
  - 루트 레이아웃 (app/layout.tsx) 최적화
  - 기본 페이지 구조 설정
  - 공통 스타일링 구조

### 1.1.2 환경 변수 설정 (Supabase, n8n)
- [ ] **환경 변수 파일 구조 설정**
  - `.env.local` 파일 생성
  - `.env.example` 파일 생성 (민감 정보 제외)
  - 환경 변수 타입 정의 파일 생성

- [ ] **Supabase 환경 변수 구성**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (서버사이드용)

- [ ] **n8n 환경 변수 구성**
  - `N8N_WEBHOOK_URL`
  - `N8N_API_KEY` (필요시)

- [ ] **환경 변수 검증 함수 구현**
  - 개발/프로덕션 환경 구분
  - 필수 환경 변수 존재 확인
  - 환경 변수 타입 안전성 보장

### 1.1.3 TypeScript 타입 정의 설정
- [ ] **기본 타입 정의**
  ```typescript
  type User = {
    id: string;
    email: string;
    created_at: string;
  };

  type MealType = '아침' | '점심' | '저녁' | '간식';

  type FoodItem = {
    foodName: string;
    confidence: number;
    quantity: string;
    calories: number;
    nutrients: {
      carbohydrates: { value: number; unit: string };
      protein: { value: number; unit: string };
      fat: { value: number; unit: string };
      sugars: { value: number; unit: string };
      sodium: { value: number; unit: string };
    };
  };
  ```

- [ ] **API 응답 타입 정의**
  ```typescript
  type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
      code: string;
      message: string;
    };
  };

  type UploadResponse = ApiResponse<{
    items: FoodItem[];
    summary: {
      totalCalories: number;
      totalCarbohydrates: { value: number; unit: string };
      totalProtein: { value: number; unit: string };
      totalFat: { value: number; unit: string };
    };
  }>;
  ```

- [ ] **데이터베이스 관련 타입 정의**
  ```typescript
  type FoodLog = {
    id: string;
    user_id: string;
    meal_type: MealType;
    image_url: string;
    items: FoodItem[];
    summary: {
      totalCalories: number;
      totalCarbohydrates: number;
      totalProtein: number;
      totalFat: number;
    };
    created_at: string;
    updated_at: string;
  };
  ```

## 1.2 Supabase 테이블 및 인증 설정

### 1.2.1 Supabase 프로젝트 초기 설정
- [ ] **Supabase 프로젝트 생성 및 연결**
  - Supabase 계정 생성 또는 기존 프로젝트 사용
  - 프로젝트 설정 및 API 키 확인
  - 로컬 개발 환경과 연결 테스트

- [ ] **인증 설정 구성**
  - 이메일 인증 활성화
  - 비밀번호 재설정 기능 활성화
  - 인증 관련 이메일 템플릿 설정

### 1.2.2 데이터베이스 스키마 설계 및 생성
- [ ] **food_logs 테이블 설계**
  ```sql
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
  ```

- [ ] **인덱스 및 성능 최적화**
  - user_id 인덱스 생성
  - created_at 인덱스 생성
  - meal_type 인덱스 생성

- [ ] **RLS (Row Level Security) 정책 설정**
  - 사용자별 데이터 접근 제한
  - INSERT, SELECT, UPDATE, DELETE 정책 설정
  - 서비스 역할 키를 통한 관리자 접근 설정

### 1.2.3 Supabase Storage 설정
- [ ] **Storage 버킷 생성**
  - `meal-images` 버킷 생성
  - 버킷 공개 설정 (이미지 접근용)

- [ ] **Storage 정책 설정**
  - 업로드 정책: 인증된 사용자만 업로드 가능
  - 다운로드 정책: 공개 읽기 또는 인증된 사용자만
  - 파일 크기 제한 설정 (예: 10MB)

- [ ] **이미지 처리 최적화**
  - 이미지 압축 설정
  - 썸네일 자동 생성
  - 이미지 포맷 변환 설정

## 완료 조건

### 1.1 프로젝트 구조 및 환경 설정 완료
- [ ] Next.js 프로젝트 구조가 Server Actions와 명확히 분리됨
- [ ] 모든 환경 변수가 올바르게 설정됨
- [ ] TypeScript 타입 정의가 완전하고 타입 안전함
- [ ] 개발 서버가 정상 실행됨

### 1.2 Supabase 테이블 및 인증 설정 완료
- [ ] Supabase 프로젝트가 생성되고 연결됨
- [ ] food_logs 테이블이 올바르게 생성됨
- [ ] RLS 정책이 올바르게 설정됨
- [ ] Storage 버킷이 생성되고 정책이 설정됨
- [ ] 인증이 정상 동작함

## 다음 단계 의존성

Phase 1 완료 → Phase 2 (사용자 인증 시스템 구현)

## 참고 자료
- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Supabase 문서](https://supabase.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)
