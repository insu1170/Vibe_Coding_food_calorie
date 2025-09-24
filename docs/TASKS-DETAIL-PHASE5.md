# Phase 5: 사용자 인터페이스 구현 - 상세 Task

## 5.1 식단 기록 페이지 사용자 인터페이스 구현

### 5.1.1 메인 식단 기록 페이지
- [ ] **메인 페이지 구조 구현**
  - `app/page.tsx` 또는 `app/dashboard/page.tsx` 구성
  - 중앙에 위치한 업로드 버튼/영역
  - 직관적인 아이콘과 텍스트
  - 로딩 상태를 위한 플레이스홀더

- [ ] **이미지 업로드 컴포넌트 구현**
  ```tsx
  // components/MealUpload.tsx
  'use client';

  import { useState, useRef, useTransition } from 'react';
  import { uploadMealAction } from '@/app/actions/upload-meal';

  export function MealUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (file: File) => {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 검증 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('파일 크기는 10MB 이하여야 합니다.');
        return;
      }

      setPreview(URL.createObjectURL(file));
      setIsUploading(true);

      const formData = new FormData();
      formData.append('image', file);

      startTransition(async () => {
        try {
          const result = await uploadMealAction(formData);

          if (result.success) {
            alert('식단 기록이 완료되었습니다!');
            setPreview(null);
            // 성공 처리 - 페이지 리디렉션 또는 상태 업데이트
            window.location.reload();
          } else {
            alert(result.error?.message || '업로드 중 오류가 발생했습니다.');
          }
        } catch (error) {
          alert(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.');
        } finally {
          setIsUploading(false);
        }
      });
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    };

    return (
      <div className="meal-upload-container">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />

        <div
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={handleButtonClick}
        >
          {preview ? (
            <img src={preview} alt="Preview" className="image-preview" />
          ) : (
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <p>음식 사진을 업로드하세요</p>
              <small>또는 여기를 클릭하여 파일을 선택하세요</small>
            </div>
          )}
        </div>

        {(isUploading || isPending) && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>식단을 분석하고 있습니다...</p>
          </div>
        )}
      </div>
    );
  }
  ```

### 5.1.2 Server Actions 연동
- [ ] **Server Actions 호출 구현**
  - `uploadMealAction` Server Action 호출
  - 로딩 상태 관리
  - 성공/실패 처리
  - 사용자 피드백

- [ ] **파일 선택 핸들러 구현**
  - 카메라 접근 (모바일)
  - 갤러리 접근
  - 파일 유효성 검증
  - 미리보기 기능

- [ ] **드래그 앤 드롭 지원**
  - 데스크톱 환경 지원
  - 파일 드롭 이벤트 처리
  - 시각적 피드백

## 5.2 날짜별, 끼니별 식단 대시보드 구현

### 5.2.1 대시보드 메인 페이지
- [ ] **대시보드 레이아웃 구현**
  - `app/meals/page.tsx` 생성
  - 날짜별 네비게이션
  - 끼니별 섹션 분리

- [ ] **식단 데이터 조회 Server Action**
  ```typescript
  // app/actions/get-meals.ts
  'use server'

  import { createClient } from '@/lib/supabase/server';
  import { redirect } from 'next/navigation';

  export async function getMealsByDate(date: string) {
    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('인증이 필요합니다.');
      }

      // 날짜 형식 검증
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        throw new Error('올바른 날짜 형식이 아닙니다.');
      }

      const { data: meals, error } = await supabase
        .from('food_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', `${date}T00:00:00`)
        .lt('created_at', `${date}T23:59:59`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error('데이터베이스 조회 중 오류가 발생했습니다.');
      }

      // 끼니별 그룹화
      const groupedMeals = meals?.reduce((acc, meal) => {
        const mealType = meal.meal_type;
        if (!acc[mealType]) acc[mealType] = [];
        acc[mealType].push(meal);
        return acc;
      }, {} as Record<string, any[]>) || {};

      return {
        success: true,
        data: { meals: groupedMeals, date }
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '서버 내부 오류입니다.');
    }
  }
  ```

### 5.2.2 끼니별 그룹화 UI
- [ ] **끼니별 섹션 컴포넌트**
  ```tsx
  // components/MealSection.tsx
  export function MealSection({ mealType, meals }: { mealType: string; meals: any[] }) {
    const totalCalories = meals.reduce((sum, meal) =>
      sum + meal.summary.totalCalories, 0);

    return (
      <div className="meal-section">
        <div className="meal-header">
          <h3>{mealType}</h3>
          <span className="calorie-summary">{totalCalories} kcal</span>
        </div>

        <div className="meal-list">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      </div>
    );
  }
  ```

### 5.2.3 식단 상세 조회
- [ ] **개별 식단 카드 컴포넌트**
  ```tsx
  // components/MealCard.tsx
  export function MealCard({ meal }: { meal: any }) {
    return (
      <div className="meal-card">
        <div className="meal-image">
          <img src={meal.image_url} alt="Meal" />
        </div>

        <div className="meal-info">
          <div className="meal-items">
            {meal.items.map((item: any, index: number) => (
              <div key={index} className="food-item">
                <span className="food-name">{item.foodName}</span>
                <span className="calories">{item.calories} kcal</span>
              </div>
            ))}
          </div>

          <div className="meal-summary">
            <div className="nutrient-summary">
              <span>탄수화물: {meal.summary.totalCarbohydrates}g</span>
              <span>단백질: {meal.summary.totalProtein}g</span>
              <span>지방: {meal.summary.totalFat}g</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

### 5.2.4 날짜별 총 섭취 칼로리 요약
- [ ] **일일 요약 컴포넌트**
  ```tsx
  // components/DailySummary.tsx
  export function DailySummary({ date, meals }: { date: string; meals: any }) {
    const totalCalories = Object.values(meals).flat().reduce((sum: number, meal: any) =>
      sum + meal.summary.totalCalories, 0);

    const totalNutrients = Object.values(meals).flat().reduce((acc: any, meal: any) => ({
      carbohydrates: acc.carbohydrates + meal.summary.totalCarbohydrates,
      protein: acc.protein + meal.summary.totalProtein,
      fat: acc.fat + meal.summary.totalFat,
    }), { carbohydrates: 0, protein: 0, fat: 0 });

    return (
      <div className="daily-summary">
        <h2>{new Date(date).toLocaleDateString('ko-KR')} 식단</h2>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">총 칼로리</span>
            <span className="stat-value">{totalCalories} kcal</span>
          </div>
          <div className="stat">
            <span className="stat-label">탄수화물</span>
            <span className="stat-value">{totalNutrients.carbohydrates}g</span>
          </div>
          <div className="stat">
            <span className="stat-label">단백질</span>
            <span className="stat-value">{totalNutrients.protein}g</span>
          </div>
          <div className="stat">
            <span className="stat-label">지방</span>
            <span className="stat-value">{totalNutrients.fat}g</span>
          </div>
        </div>
      </div>
    );
  }
  ```

## 완료 조건

### 5.1 식단 기록 페이지 사용자 인터페이스 구현 완료
- [ ] 메인 식단 기록 페이지가 완성됨
- [ ] Server Actions와 연동된 이미지 업로드 기능이 정상 동작함
- [ ] 카메라/갤러리 접근이 가능함
- [ ] 로딩 상태 UI가 구현됨
- [ ] 업로드 완료 처리 로직이 동작함

### 5.2 날짜별, 끼니별 식단 대시보드 구현 완료
- [ ] 대시보드 메인 페이지가 완성됨
- [ ] 식단 데이터 조회 Server Action이 정상 동작함
- [ ] 끼니별 그룹화 UI가 구현됨
- [ ] 식단 상세 조회 기능이 동작함
- [ ] 날짜별 총 섭취 칼로리 요약이 표시됨

## 다음 단계 의존성

Phase 5 완료 → Phase 6 (UI/UX 개선)

## 참고 자료
- [Next.js App Router Pages](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)
- [React File Upload](https://react.dev/reference/react-dom/components/input#file-inputs)
- [CSS Grid & Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
