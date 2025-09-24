'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ApiResponse } from '@/lib/types';
import { sendImageToWebhook, transformWebhookResponse } from '@/lib/webhook';

export async function saveMealRecord(analysisData: any): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 분석 데이터에서 사용자 ID 가져오기
    const userId = analysisData.userId || `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 임시 사용자 객체 생성
    const actualUser = user || {
      id: userId,
      email: user?.email || 'anonymous@meallog.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;

    // Supabase Storage에 이미지 업로드 (임시로 생략)
    const imageUrl = `https://picsum.photos/300/300?random=${Date.now()}`; // 임시 이미지 URL

    // 데이터베이스에 식단 기록 저장
    const { data, error: insertError } = await supabase
      .from('food_logs')
      .insert({
        user_id: actualUser.id,
        meal_type: analysisData.mealType,
        items: analysisData.items,
        summary: analysisData.summary,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('식단 기록 저장 중 오류가 발생했습니다.');
    }

    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Save meal error:', error);

    return {
      success: false,
      error: {
        code: 'SAVE_FAILED',
        message: error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.'
      }
    };
  }
}

export async function uploadMealAction(formData: FormData): Promise<ApiResponse<any>> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // formData에서 사용자 ID 가져오기 (로그인된 사용자가 있는 경우)
    let userId = formData.get('userId') as string;
    console.log('Server received userId:', userId);

    // 사용자 ID가 없으면 임시 익명 사용자 ID 생성
    if (!userId) {
      userId = `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      console.log('Generated anonymous userId:', userId);
    }

    // 임시 사용자 객체 생성 (로그인된 사용자 또는 익명 사용자)
    const actualUser = user || {
      id: userId,
      email: user?.email || 'anonymous@meallog.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;

    const file = formData.get('image') as File;
    if (!file) {
      throw new Error('이미지 파일이 필요합니다.');
    }

    // 파일 유효성 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('파일 크기는 10MB 이하여야 합니다.');
    }

    // n8n 웹훅으로 이미지 분석 요청
    console.log('Sending image to n8n webhook for analysis...');
    let webhookResponse;

    try {
      webhookResponse = await sendImageToWebhook(file);
    } catch (error) {
      console.error('Webhook call failed:', error);
      throw new Error('AI 분석 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }

    // 웹훅 응답을 식단 분석 결과로 변환
    const analysisResult = transformWebhookResponse(webhookResponse);

    // 시간 기반 끼니 분류 추가
    const now = new Date();
    const hour = now.getHours();
    let mealType: '아침' | '점심' | '저녁' | '간식';

    if (hour >= 4 && hour < 11) {
      mealType = '아침';
    } else if (hour >= 11 && hour < 17) {
      mealType = '점심';
    } else if (hour >= 17 && hour < 22) {
      mealType = '저녁';
    } else {
      mealType = '간식';
    }

    // 분석 결과에 끼니 정보 추가
    const resultWithMealType = {
      ...analysisResult,
      data: {
        ...analysisResult.data,
        mealType,
        analyzedAt: now.toISOString(),
        userId: actualUser.id
      }
    };

    console.log('Analysis completed successfully:', resultWithMealType);
    return resultWithMealType;

  } catch (error) {
    console.error('Upload meal error:', error);

    // 에러 타입에 따른 구체적인 메시지
    let errorMessage = '업로드 중 알 수 없는 오류가 발생했습니다.';
    let errorCode = 'UPLOAD_FAILED';

    if (error instanceof Error) {
      if (error.message.includes('웹훅')) {
        errorCode = 'WEBHOOK_ERROR';
        errorMessage = error.message;
      } else if (error.message.includes('파일')) {
        errorCode = 'FILE_ERROR';
        errorMessage = error.message;
      } else if (error.message.includes('데이터베이스')) {
        errorCode = 'DATABASE_ERROR';
        errorMessage = '데이터 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage
      }
    };
  }
}
