# Phase 3: n8n 웹훅 연동 - 상세 Task

## 3.1 n8n 웹훅 엔드포인트 설정

### 3.1.1 n8n 웹훅 생성 및 설정
- [ ] **n8n 워크플로우 기본 구조 생성**
  - n8n에서 새 워크플로우 생성
  - Webhook 트리거 노드 추가
  - HTTP Method: POST로 설정
  - Path: `/api/meal-analysis` 또는 `/webhook/meal-analysis`

- [ ] **웹훅 트리거 설정**
  - Content-Type: `multipart/form-data` 지원
  - 입력 파라미터: `image` (파일), `userId` (텍스트)
  - 에러 핸들링 설정

- [ ] **기본 에러 핸들링 설정**
  - 잘못된 요청 형식 처리
  - 필수 파라미터 검증
  - 타임아웃 설정

## 3.2 Next.js에서 n8n으로 이미지 업로드 Server Actions 구현

### 3.2.1 이미지 업로드 Server Action
- [ ] **Server Action 구조 생성**
  - `app/actions/upload-meal.ts` 파일 생성
  - 'use server' 지시자 사용
  - Supabase 인증 및 n8n 연동

- [ ] **Server Action 구현**
  ```typescript
  // app/actions/upload-meal.ts
  'use server'

  import { createClient } from '@/lib/supabase/server';
  import { uploadToN8n } from '@/lib/n8n';
  import { redirect } from 'next/navigation';

  export async function uploadMealImage(formData: FormData) {
    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('인증이 필요합니다.');
      }

      const image = formData.get('image') as File;

      if (!image) {
        throw new Error('이미지 파일이 필요합니다.');
      }

      // 파일 형식 검증
      if (!image.type.startsWith('image/')) {
        throw new Error('이미지 파일만 업로드 가능합니다.');
      }

      // 파일 크기 검증 (10MB)
      if (image.size > 10 * 1024 * 1024) {
        throw new Error('파일 크기는 10MB 이하여야 합니다.');
      }

      // n8n으로 업로드 및 분석
      const result = await uploadToN8n(image, user.id);

      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error instanceof Error ? error.message : '서버 내부 오류입니다.');
    }
  }
  ```

### 3.2.2 n8n 연동 서비스 함수
- [ ] **n8n API 호출 함수 구현**
  - `lib/n8n/client.ts` 파일 생성
  - HTTP 클라이언트 설정
  - 재시도 로직 구현

- [ ] **이미지 업로드 함수 구현**
  ```typescript
  // lib/n8n/index.ts
  export async function uploadToN8n(image: File, userId: string) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', userId);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30초 타임아웃

    try {
      const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      // 응답 유효성 검증
      if (!result.success) {
        throw new Error(result.error?.message || '분석 처리 중 오류가 발생했습니다.');
      }

      return result;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('요청 시간이 초과되었습니다.');
        }
        throw error;
      }

      throw new Error('n8n 서버와의 연결에 실패했습니다.');
    }
  }
  ```

- [ ] **응답 처리 및 에러 핸들링**
  - 성공 응답 처리 (PRD 78-132 참조)
  - 실패 응답 처리 (PRD 135-142 참조)
  - 재시도 로직 구현
  - 타임아웃 처리

- [ ] **Server Action 유효성 검증**
  - 이미지 파일 형식 검증 (JPEG, PNG 등)
  - 파일 크기 제한 (10MB 이하)
  - MIME 타입 검증

## 완료 조건

### 3.1 n8n 웹훅 엔드포인트 설정 완료
- [ ] n8n 웹훅이 정상 생성됨
- [ ] 웹훅이 `multipart/form-data`를 처리할 수 있음
- [ ] 기본 에러 핸들링이 설정됨

### 3.2 Next.js에서 n8n으로 이미지 업로드 Server Actions 구현 완료
- [ ] `uploadMealImage` Server Action이 정상 동작함
- [ ] Supabase 인증이 올바르게 적용됨
- [ ] 이미지 유효성 검증이 작동함
- [ ] n8n 연동이 정상 동작함
- [ ] 적절한 에러 처리가 구현됨

## 다음 단계 의존성

Phase 3 완료 → Phase 4 (n8n 자동화 워크플로우)

## 참고 자료
- [n8n Webhook 문서](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Next.js API Routes 문서](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
