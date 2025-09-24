'use client';

import { useState, useEffect } from 'react';
import { getMealsByDate } from '@/app/actions/get-meals';

interface DailySummaryProps {
  date: string;
}

export function DailySummary({ date }: DailySummaryProps) {
  const [meals, setMeals] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getMealsByDate(date);

        if (result.success) {
          setMeals(result.data?.meals || {});
        } else {
          setError(result.error?.message || '데이터를 불러오는 중 오류가 발생했습니다.');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [date]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-4 gap-4">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // 모든 끼니의 데이터를 평탄화하여 총합 계산
  const allMeals = Object.values(meals || {}).flat() as any[];

  if (allMeals.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {new Date(date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </h3>
          <p className="text-gray-600 text-sm mb-4">아직 기록된 식단이 없습니다</p>

          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-xs text-gray-500">총 칼로리</div>
              <div className="font-semibold text-gray-900">0 kcal</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🥖</div>
              <div className="text-xs text-gray-500">탄수화물</div>
              <div className="font-semibold text-gray-900">0g</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🍗</div>
              <div className="text-xs text-gray-500">단백질</div>
              <div className="font-semibold text-gray-900">0g</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-1">🥑</div>
              <div className="text-xs text-gray-500">지방</div>
              <div className="font-semibold text-gray-900">0g</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            💡 첫 식단을 기록하고 영양 정보를 확인해보세요!
          </div>
        </div>
      </div>
    );
  }

  const totalCalories = allMeals.reduce((sum, meal) => sum + meal.summary.totalCalories, 0);
  const totalCarbohydrates = allMeals.reduce((sum, meal) => sum + meal.summary.totalCarbohydrates.value, 0);
  const totalProtein = allMeals.reduce((sum, meal) => sum + meal.summary.totalProtein.value, 0);
  const totalFat = allMeals.reduce((sum, meal) => sum + meal.summary.totalFat.value, 0);

  // 끼니별 칼로리
  const mealCalories = {
    아침: allMeals.filter(meal => meal.meal_type === '아침').reduce((sum, meal) => sum + meal.summary.totalCalories, 0),
    점심: allMeals.filter(meal => meal.meal_type === '점심').reduce((sum, meal) => sum + meal.summary.totalCalories, 0),
    저녁: allMeals.filter(meal => meal.meal_type === '저녁').reduce((sum, meal) => sum + meal.summary.totalCalories, 0),
    간식: allMeals.filter(meal => meal.meal_type === '간식').reduce((sum, meal) => sum + meal.summary.totalCalories, 0),
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {formatDate(date)} 식단 요약
          </h3>
          <p className="text-gray-600 text-sm">
            총 {allMeals.length}끼 기록 • {Object.values(mealCalories).filter(cal => cal > 0).length}끼 식사
          </p>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{totalCalories} kcal</div>
          <div className="text-sm text-gray-500">총 칼로리</div>
        </div>
      </div>

      {/* 주요 영양소 요약 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-xs text-gray-600 mb-1">총 칼로리</div>
          <div className="font-bold text-gray-900">{totalCalories}</div>
          <div className="text-xs text-gray-500">kcal</div>
        </div>

        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <div className="text-2xl mb-1">🥖</div>
          <div className="text-xs text-gray-600 mb-1">탄수화물</div>
          <div className="font-bold text-gray-900">{totalCarbohydrates.toFixed(1)}</div>
          <div className="text-xs text-gray-500">g</div>
        </div>

        <div className="text-center p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100">
          <div className="text-2xl mb-1">🍗</div>
          <div className="text-xs text-gray-600 mb-1">단백질</div>
          <div className="font-bold text-gray-900">{totalProtein.toFixed(1)}</div>
          <div className="text-xs text-gray-500">g</div>
        </div>

        <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
          <div className="text-2xl mb-1">🥑</div>
          <div className="text-xs text-gray-600 mb-1">지방</div>
          <div className="font-bold text-gray-900">{totalFat.toFixed(1)}</div>
          <div className="text-xs text-gray-500">g</div>
        </div>
      </div>

      {/* 끼니별 칼로리 분포 */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">끼니별 칼로리 분포</h4>

        <div className="space-y-3">
          {Object.entries(mealCalories).map(([mealType, calories]) => {
            if (calories === 0) return null;

            const percentage = totalCalories > 0 ? (calories / totalCalories) * 100 : 0;
            const mealIcons: Record<string, string> = {
              '아침': '🌅',
              '점심': '☀️',
              '저녁': '🌙',
              '간식': '🍪'
            };

            return (
              <div key={mealType} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{mealIcons[mealType]}</span>
                  <span className="text-sm font-medium text-gray-900">{mealType}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className="text-sm font-semibold text-gray-900">{calories}</span>
                    <span className="text-xs text-gray-500 ml-1">kcal</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 식단 품질 지표 */}
      {totalCalories > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">오늘의 식단 균형</p>
              <p className="text-xs text-blue-700">
                탄:단:지 비율 = {totalCarbohydrates.toFixed(0)}:{totalProtein.toFixed(0)}:{totalFat.toFixed(0)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-blue-900">
                {totalProtein >= 50 && totalCarbohydrates <= totalCalories * 0.65 ? '🥗 균형' : '⚖️ 개선 필요'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
