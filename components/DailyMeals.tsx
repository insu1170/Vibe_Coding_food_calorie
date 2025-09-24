'use client';

import { useState, useEffect } from 'react';
import { getMealsByDate } from '@/app/actions/get-meals';
import { FoodLog, MealType } from '@/lib/types';

interface DailyMealsProps {
  date: string;
}

export function DailyMeals({ date }: DailyMealsProps) {
  const [meals, setMeals] = useState<Record<MealType, FoodLog[]> | null>(null);
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
          setError(result.error?.message || '식단 데이터를 불러오는 중 오류가 발생했습니다.');
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">식단 데이터를 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!meals || Object.keys(meals).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍽️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 기록된 식단이 없습니다</h3>
          <p className="text-gray-600 mb-4">맛있는 음식을 먹고 사진으로 기록해보세요!</p>
          <p className="text-sm text-gray-500">
            💡 팁: 사진을 업로드하면 AI가 자동으로 분석하고 끼니별로 분류합니다.
          </p>
        </div>
      </div>
    );
  }

  const mealTypes: MealType[] = ['아침', '점심', '저녁', '간식'];
  const mealIcons: Record<MealType, string> = {
    '아침': '🌅',
    '점심': '☀️',
    '저녁': '🌙',
    '간식': '🍪'
  };

  const mealColors: Record<MealType, string> = {
    '아침': 'from-yellow-50 to-orange-50 border-yellow-200',
    '점심': 'from-blue-50 to-indigo-50 border-blue-200',
    '저녁': 'from-purple-50 to-pink-50 border-purple-200',
    '간식': 'from-green-50 to-emerald-50 border-green-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">끼니별 식단 기록</h3>

      <div className="space-y-6">
        {mealTypes.map((mealType) => {
          const mealData = meals[mealType];
          if (!mealData || mealData.length === 0) return null;

          const totalCalories = mealData.reduce((sum, meal) => sum + meal.summary.totalCalories, 0);

          return (
            <div key={mealType} className={`bg-gradient-to-br ${mealColors[mealType]} rounded-xl border-2 p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xl">{mealIcons[mealType]}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{mealType}</h4>
                    <p className="text-sm text-gray-600">{mealData.length}개 기록</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{totalCalories} kcal</p>
                  <p className="text-sm text-gray-600">총 칼로리</p>
                </div>
              </div>

              <div className="space-y-3">
                {mealData.map((meal, index) => (
                  <div key={meal.id} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            기록 #{mealData.length - index}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(meal.created_at).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {meal.image_url && (
                          <div className="mb-3">
                            <img
                              src={meal.image_url}
                              alt="Meal"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          {meal.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between items-center py-1">
                              <div className="flex-1">
                                <span className="font-medium text-gray-900">{item.foodName}</span>
                                <span className="text-sm text-gray-500 ml-2">({item.quantity})</span>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">{item.calories} kcal</span>
                                <div className="text-xs text-gray-500">
                                  {item.nutrients.protein.value}g 단백질
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">총계:</span>
                            <div className="text-right">
                              <span className="font-semibold text-gray-900">
                                {meal.summary.totalCalories} kcal
                              </span>
                              <div className="text-xs text-gray-500">
                                탄수화물 {meal.summary.totalCarbohydrates.value}g
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
