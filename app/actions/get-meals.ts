'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ApiResponse, FoodLog } from '@/lib/types';

export async function getMealsByDate(date: string): Promise<ApiResponse<{ meals: Record<string, FoodLog[]>, date: string }>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('올바른 날짜 형식이 아닙니다.');
    }

    // 해당 날짜의 식단 기록 조회
    const { data: meals, error } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${date}T00:00:00`)
      .lt('created_at', `${date}T23:59:59`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database query error:', error);
      throw new Error('데이터베이스 조회 중 오류가 발생했습니다.');
    }

    // 끼니별로 그룹화
    const groupedMeals = meals?.reduce((acc, meal) => {
      const mealType = meal.meal_type;
      if (!acc[mealType]) acc[mealType] = [];
      acc[mealType].push(meal);
      return acc;
    }, {} as Record<string, FoodLog[]>) || {};

    return {
      success: true,
      data: { meals: groupedMeals, date }
    };

  } catch (error) {
    console.error('Get meals error:', error);
    return {
      success: false,
      error: {
        code: 'FETCH_FAILED',
        message: error instanceof Error ? error.message : '식단 데이터를 불러오는 중 오류가 발생했습니다.'
      }
    };
  }
}
