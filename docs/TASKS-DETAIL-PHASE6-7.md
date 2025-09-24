# Phase 6-7: UI/UX 개선 및 품질 보증 - 상세 Task

## 6.1 모바일 응답형 디자인 적용

### 6.1.1 반응형 레이아웃 구현
- [ ] **CSS 반응형 디자인 설정**
  ```css
  /* globals.css */
  .meal-upload-container {
    max-width: 100%;
    margin: 0 auto;
    padding: 1rem;
  }

  @media (max-width: 768px) {
    .meal-upload-container {
      padding: 0.5rem;
    }

    .upload-area {
      min-height: 300px;
      border-radius: 12px;
    }

    .meal-card {
      margin: 0.5rem 0;
    }
  }

  @media (max-width: 480px) {
    .upload-area {
      min-height: 250px;
    }

    .meal-section {
      margin: 0.5rem 0;
    }
  }
  ```

- [ ] **모바일 최적화 CSS**
  - 터치 타겟 크기 44px 이상
  - 적절한 폰트 크기
  - 여백 및 패딩 조정

### 6.1.2 터치 친화적 UI 요소
- [ ] **터치 이벤트 핸들링**
  ```tsx
  // 터치 이벤트 지원
  const handleTouchStart = (e: React.TouchEvent) => {
    // 터치 시작 시 처리
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 터치 종료 시 처리
  };
  ```

- [ ] **모바일 네비게이션**
  - 하단 탭 바 구현
  - 모바일 최적화 메뉴
  - 페이지 전환 애니메이션

## 6.2 사용자 경험 최적화

### 6.2.1 로딩 스피너 및 애니메이션
- [ ] **로딩 컴포넌트 구현**
  ```tsx
  // components/LoadingSpinner.tsx
  export function LoadingSpinner({ message }: { message?: string }) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        {message && <p>{message}</p>}
      </div>
    );
  }
  ```

- [ ] **스켈레톤 로딩**
  ```tsx
  // components/SkeletonLoader.tsx
  export function SkeletonLoader() {
    return (
      <div className="skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-text"></div>
      </div>
    );
  }
  ```

### 6.2.2 직관적인 아이콘 및 색상 사용
- [ ] **아이콘 시스템 구현**
  - 업로드 아이콘 (📷)
  - 끼니별 아이콘 (🌅 🍱 🍽️ 🍪)
  - 성공/실패 아이콘 (✅ ❌)

- [ ] **색상 팔레트 정의**
  ```css
  :root {
    --primary-color: #0070f3;
    --success-color: #10b981;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
    --background-color: #ffffff;
    --text-color: #1f2937;
  }
  ```

### 6.2.3 접근성 개선
- [ ] **ARIA 속성 추가**
  ```tsx
  <button
    aria-label="식단 사진 업로드"
    aria-describedby="upload-help"
  >
    업로드
  </button>
  ```

- [ ] **키보드 네비게이션 지원**
  - Tab 키로 포커스 이동
  - Enter/Space 키로 액션 실행
  - ESC 키로 모달 닫기

## 7.1 기본 테스트 및 에러 핸딩 설정

### 7.1.1 에러 핸들링 개선
- [ ] **전역 에러 바운더리**
  ```tsx
  // components/ErrorBoundary.tsx
  export class ErrorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: any) {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <h1>문제가 발생했습니다.</h1>;
      }

      return this.props.children;
    }
  }
  ```

- [ ] **API 에러 처리**
  - 재시도 로직 구현
  - 사용자 친화적 에러 메시지
  - 에러 로깅 시스템

### 7.1.2 사용자 친화적 에러 메시지
- [ ] **에러 메시지 컴포넌트**
  ```tsx
  // components/ErrorMessage.tsx
  export function ErrorMessage({
    error,
    onRetry
  }: {
    error: string;
    onRetry?: () => void;
  }) {
    return (
      <div className="error-message">
        <p>⚠️ {error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            다시 시도
          </button>
        )}
      </div>
    );
  }
  ```

## 7.2 기본 테스트 작성

### 7.2.1 주요 함수 단위 테스트
- [ ] **API 함수 테스트**
  ```typescript
  // __tests__/lib/n8n.test.ts
  import { uploadToN8n } from '@/lib/n8n';

  describe('uploadToN8n', () => {
    it('should upload image successfully', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = { success: true, data: { items: [] } };

      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        })
      );

      const result = await uploadToN8n(mockFile, 'user123');
      expect(result).toEqual(mockResponse);
    });

    it('should handle upload failure', async () => {
      // 실패 케이스 테스트
    });
  });
  ```

### 7.2.2 API 엔드포인트 테스트
- [ ] **Next.js API 테스트**
  ```typescript
  // __tests__/app/api/upload/route.test.ts
  import { POST } from '@/app/api/upload/route';

  describe('/api/upload', () => {
    it('should require authentication', async () => {
      // 인증되지 않은 요청 테스트
    });

    it('should validate file type', async () => {
      // 잘못된 파일 형식 테스트
    });
  });
  ```

### 7.2.3 사용자 플로우 테스트
- [ ] **E2E 테스트 시나리오**
  - 사용자 로그인 → 식단 업로드 → 대시보드 확인
  - 에러 상황 처리
  - 반응형 동작 확인

## 완료 조건

### 6.1 모바일 응답형 디자인 적용 완료
- [ ] 반응형 레이아웃이 모든 화면 크기에서 동작함
- [ ] 터치 친화적 UI 요소가 구현됨
- [ ] 모바일 네비게이션이 최적화됨

### 6.2 사용자 경험 최적화 완료
- [ ] 로딩 스피너와 애니메이션이 구현됨
- [ ] 직관적인 아이콘과 색상이 사용됨
- [ ] 접근성 기능이 추가됨

### 7.1 기본 테스트 및 에러 핸딩 설정 완료
- [ ] 전역 에러 바운더리가 구현됨
- [ ] API 에러 처리가 개선됨
- [ ] 사용자 친화적 에러 메시지가 표시됨

### 7.2 기본 테스트 작성 완료
- [ ] 주요 함수 단위 테스트가 작성됨
- [ ] API 엔드포인트 테스트가 작성됨
- [ ] 사용자 플로우 테스트가 작성됨

## 다음 단계 의존성

Phase 6-7 완료 → 프로젝트 완료

## 참고 자료
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
