# Phase 2: 사용자 인증 시스템 구현 - 상세 Task

## 2.1 Next.js 사용자 인증 시스템 구현

### 2.1.1 Supabase Auth 클라이언트 설정
- [ ] **Supabase 클라이언트 초기화**
  - `lib/supabase/client.ts` 파일 생성
  - 브라우저용 클라이언트 설정
  - 서버용 클라이언트 설정 (`lib/supabase/server.ts`)

- [ ] **환경 변수 기반 클라이언트 구성**
  ```typescript
  // lib/supabase/client.ts
  import { createBrowserClient } from '@supabase/ssr'

  export function createClient() {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  ```

- [ ] **서버사이드 클라이언트 설정**
  ```typescript
  // lib/supabase/server.ts
  import { createServerClient } from '@supabase/ssr'
  import { cookies } from 'next/headers'

  export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
  }
  ```

### 2.1.2 Auth Context Provider 생성
- [ ] **Auth Context 타입 정의**
  ```typescript
  // types/auth.ts
  export type AuthUser = {
    id: string;
    email: string;
    created_at: string;
  };

  export type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
  };
  ```

- [ ] **Auth Context Provider 구현**
  - `contexts/AuthContext.tsx` 파일 생성
  - Supabase auth state 관리
  - 사용자 세션 처리

- [ ] **Auth Provider 컴포넌트**
  ```typescript
  // contexts/AuthContext.tsx
  'use client';

  import { createContext, useContext, useEffect, useState } from 'react';
  import { User } from '@supabase/supabase-js';
  import { createClient } from '@/lib/supabase/client';

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // ... auth methods implementation
  }
  ```

### 2.1.3 로그인/회원가입 UI 구현
- [ ] **로그인 페이지 구현**
  - `app/auth/signin/page.tsx` 생성
  - 이메일/비밀번호 입력 폼
  - 에러 메시지 처리
  - 로딩 상태 처리

- [ ] **회원가입 페이지 구현**
  - `app/auth/signup/page.tsx` 생성
  - 회원가입 폼 구현
  - 비밀번호 확인 기능
  - 이메일 인증 안내

- [ ] **공통 Auth 컴포넌트들**
  - `components/auth/AuthForm.tsx` - 재사용 가능한 폼 컴포넌트
  - `components/auth/AuthInput.tsx` - 입력 필드 컴포넌트
  - `components/auth/AuthButton.tsx` - 버튼 컴포넌트

### 2.1.4 인증 미들웨어 및 보호
- [ ] **Protected Route HOC 구현**
  ```typescript
  // components/auth/ProtectedRoute.tsx
  'use client';

  import { useAuth } from '@/contexts/AuthContext';
  import { useRouter } from 'next/navigation';
  import { useEffect } from 'react';

  export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/signin');
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return <>{children}</>;
  }
  ```

- [ ] **미들웨어 설정**
  - `middleware.ts` 파일 생성
  - 보호된 경로 설정 (/dashboard, /meals 등)
  - 인증되지 않은 사용자의 리다이렉트 처리

- [ ] **로그아웃 기능 구현**
  - 로그아웃 버튼 컴포넌트
  - 로그아웃 핸들러
  - 세션 정리

## 완료 조건

### 2.1 Next.js 사용자 인증 시스템 구현 완료
- [ ] Supabase 클라이언트가 올바르게 초기화됨
- [ ] Auth Context가 전역적으로 동작함
- [ ] 로그인/회원가입 UI가 완성됨
- [ ] 보호된 라우트가 정상 동작함
- [ ] 로그아웃 기능이 정상 동작함
- [ ] 사용자 세션이 올바르게 관리됨

## 다음 단계 의존성

Phase 2 완료 → Phase 3 (n8n 웹훅 연동)

## 참고 자료
- [Supabase Auth 문서](https://supabase.com/docs/guides/auth)
- [Next.js Middleware 문서](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Context API](https://react.dev/reference/react/useContext)
