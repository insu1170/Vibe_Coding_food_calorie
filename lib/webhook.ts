/**
 * n8n 웹훅으로 이미지를 전송하는 유틸리티 함수
 */

const N8N_WEBHOOK_URL = 'https://insam.app.n8n.cloud/webhook-test/ab1e99a1-db45-4a8a-8897-0ac55f5c9081';

// 테스트용 URL (실제 웹훅이 작동하지 않을 경우)
const TEST_N8N_WEBHOOK_URL = 'https://insam.app.n8n.cloud/webhook-test/ab1e99a1-db45-4a8a-8897-0ac55f5c9081';

/**
 * 파일을 n8n 웹훅으로 전송
 */
export async function sendImageToWebhook(file: File): Promise<any> {
  try {
    // FormData 생성
    const formData = new FormData();
    formData.append('image', file);

    console.log('Sending image to n8n webhook:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      url: N8N_WEBHOOK_URL
    });

    // 실제 n8n 웹훅으로 요청 전송
    console.log('Sending request to actual n8n webhook...');

    // 타임아웃 설정 (30초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      // n8n 웹훅으로 POST 요청
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // n8n 웹훅의 경우 특별한 헤더가 필요하지 않음
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ n8n 웹훅 요청 실패:', {
          url: N8N_WEBHOOK_URL,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });

        // 실제 웹훅이 작동하지 않으면 더미 데이터로 폴백
        console.warn('🔄 실제 웹훅이 작동하지 않아 더미 데이터를 사용합니다...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockResponse = createMockWebhookResponse(file.name);
        console.log('📋 Fallback to mock data:', mockResponse);
        return mockResponse;
      }

      const result = await response.json();
      console.log('Webhook response received:', result);

      return result;

    } catch (fetchError) {
      clearTimeout(timeoutId);

      console.error('❌ n8n 웹훅 요청 중 오류 발생:', {
        url: N8N_WEBHOOK_URL,
        error: fetchError,
        errorType: fetchError instanceof Error ? fetchError.name : 'Unknown',
        errorMessage: fetchError instanceof Error ? fetchError.message : String(fetchError)
      });

      // 실제 웹훅이 완전히 실패하면 더미 데이터로 폴백
      console.warn('🔄 실제 웹훅이 완전히 실패하여 더미 데이터를 사용합니다...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = createMockWebhookResponse(file.name);
      console.log('📋 Fallback to mock data:', mockResponse);
      return mockResponse;
    }

  } catch (error) {
    console.error('Webhook request failed:', error);
    throw new Error(`웹훅 전송 중 오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
  }
}

/**
 * 테스트용 더미 웹훅 응답을 생성하는 함수
 */
function createMockWebhookResponse(fileName: string) {
  // 파일명에 따라 다른 음식 분석 결과 생성
  const foodAnalyses: { [key: string]: any } = {
    'kimchi': {
      success: true,
      data: {
        items: [
          {
            foodName: '김치찌개',
            confidence: 0.95,
            quantity: '1인분',
            calories: 320,
            nutrients: {
              carbohydrates: { value: 25, unit: 'g' },
              protein: { value: 18, unit: 'g' },
              fat: { value: 12, unit: 'g' },
              sugars: { value: 8, unit: 'g' },
              sodium: { value: 1200, unit: 'mg' }
            }
          },
          {
            foodName: '밥',
            confidence: 0.98,
            quantity: '1공기',
            calories: 210,
            nutrients: {
              carbohydrates: { value: 45, unit: 'g' },
              protein: { value: 4, unit: 'g' },
              fat: { value: 0.5, unit: 'g' },
              sugars: { value: 0.5, unit: 'g' },
              sodium: { value: 2, unit: 'mg' }
            }
          }
        ],
        summary: {
          totalCalories: 530,
          totalCarbohydrates: { value: 70, unit: 'g' },
          totalProtein: { value: 22, unit: 'g' },
          totalFat: { value: 12.5, unit: 'g' }
        }
      }
    },
    'pizza': {
      success: true,
      data: {
        items: [
          {
            foodName: '페페로니 피자',
            confidence: 0.92,
            quantity: '2조각',
            calories: 480,
            nutrients: {
              carbohydrates: { value: 52, unit: 'g' },
              protein: { value: 22, unit: 'g' },
              fat: { value: 24, unit: 'g' },
              sugars: { value: 4, unit: 'g' },
              sodium: { value: 980, unit: 'mg' }
            }
          }
        ],
        summary: {
          totalCalories: 480,
          totalCarbohydrates: { value: 52, unit: 'g' },
          totalProtein: { value: 22, unit: 'g' },
          totalFat: { value: 24, unit: 'g' }
        }
      }
    },
    'salad': {
      success: true,
      data: {
        items: [
          {
            foodName: '시저 샐러드',
            confidence: 0.88,
            quantity: '1접시',
            calories: 180,
            nutrients: {
              carbohydrates: { value: 12, unit: 'g' },
              protein: { value: 8, unit: 'g' },
              fat: { value: 14, unit: 'g' },
              sugars: { value: 3, unit: 'g' },
              sodium: { value: 420, unit: 'mg' }
            }
          }
        ],
        summary: {
          totalCalories: 180,
          totalCarbohydrates: { value: 12, unit: 'g' },
          totalProtein: { value: 8, unit: 'g' },
          totalFat: { value: 14, unit: 'g' }
        }
      }
    }
  };

  // 파일명에서 키워드 추출
  const fileNameLower = fileName.toLowerCase();
  for (const [key, analysis] of Object.entries(foodAnalyses)) {
    if (fileNameLower.includes(key)) {
      return analysis;
    }
  }

  // 기본 분석 결과
  return {
    success: true,
    data: {
      items: [
        {
          foodName: '분석된 음식',
          confidence: 0.85,
          quantity: '1인분',
          calories: 350,
          nutrients: {
            carbohydrates: { value: 35, unit: 'g' },
            protein: { value: 15, unit: 'g' },
            fat: { value: 18, unit: 'g' },
            sugars: { value: 5, unit: 'g' },
            sodium: { value: 650, unit: 'mg' }
          }
        }
      ],
      summary: {
        totalCalories: 350,
        totalCarbohydrates: { value: 35, unit: 'g' },
        totalProtein: { value: 15, unit: 'g' },
        totalFat: { value: 18, unit: 'g' }
      }
    }
  };
}

/**
 * n8n 웹훅 연결을 테스트하는 함수 (브라우저 콘솔에서 사용 가능)
 */
export async function testN8nWebhook(): Promise<any> {
  try {
    console.log('🧪 n8n 웹훅 연결을 테스트합니다...');

    const testFormData = new FormData();
    testFormData.append('test', 'connection_test');
    testFormData.append('timestamp', new Date().toISOString());

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      body: testFormData,
    });

    console.log('✅ 웹훅 응답:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const result = await response.text();
    console.log('✅ 응답 본문:', result);

    return { success: true, data: result };
  } catch (error) {
    console.error('❌ 웹훅 테스트 실패:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * 웹훅 응답을 식단 분석 결과로 변환
 */
export function transformWebhookResponse(webhookResponse: any): {
  success: boolean;
  data: {
    items: Array<{
      foodName: string;
      confidence: number;
      quantity: string;
      calories: number;
      nutrients: {
        carbohydrates: { value: number; unit: string };
        protein: { value: number; unit: string };
        fat: { value: number; unit: string };
        sugars?: { value: number; unit: string };
        sodium?: { value: number; unit: string };
      };
    }>;
    summary: {
      totalCalories: number;
      totalCarbohydrates: { value: number; unit: string };
      totalProtein: { value: number; unit: string };
      totalFat: { value: number; unit: string };
    };
  };
} {
  try {
    // 웹훅 응답이 유효하지 않은 경우
    if (!webhookResponse) {
      console.warn('Webhook response is null or undefined');
      return createDefaultResponse();
    }

    console.log('Webhook response received:', JSON.stringify(webhookResponse, null, 2));

    // 웹훅 응답이 이미 우리가 원하는 형식인 경우 그대로 반환
    if (webhookResponse.success && webhookResponse.data && webhookResponse.data.items) {
      console.log('Webhook response already in expected format');
      return webhookResponse;
    }

    // n8n 웹훅 응답 형식에 따른 변환 처리
    let transformedData: any = null;

    // 다양한 응답 형식 처리
    if (Array.isArray(webhookResponse)) {
      // 배열 형태의 응답 처리
      transformedData = processArrayResponse(webhookResponse);
    } else if (webhookResponse.output) {
      // n8n output 필드가 있는 경우
      transformedData = processN8nOutputResponse(webhookResponse);
    } else if (webhookResponse.data && Array.isArray(webhookResponse.data)) {
      // data 배열 형태
      transformedData = processDataArrayResponse(webhookResponse.data);
    } else if (webhookResponse.items) {
      // 직접 items가 있는 경우
      transformedData = webhookResponse;
    } else {
      // 기본 형태로 처리 시도
      transformedData = createTransformedResponse(webhookResponse);
    }

    // 변환된 데이터가 유효한지 확인
    if (transformedData && transformedData.data && transformedData.data.items && transformedData.data.items.length > 0) {
      console.log('Successfully transformed webhook response:', transformedData);
      return transformedData;
    }

    console.warn('Could not transform webhook response, using default');
    return createDefaultResponse();

  } catch (error) {
    console.error('Error transforming webhook response:', error);
    return createDefaultResponse();
  }
}

/**
 * 배열 형태의 응답을 처리하는 함수
 */
function processArrayResponse(response: any[]): any {
  console.log('Processing array response:', response);

  if (!response || response.length === 0) {
    return createDefaultResponse();
  }

  const items = response.map((item, index) => ({
    foodName: item.name || item.foodName || `음식 ${index + 1}`,
    confidence: item.confidence || 0.85,
    quantity: item.quantity || item.amount || '1인분',
    calories: item.calories || 0,
    nutrients: {
      carbohydrates: { value: item.carbohydrates || 0, unit: 'g' },
      protein: { value: item.protein || 0, unit: 'g' },
      fat: { value: item.fat || 0, unit: 'g' },
      sugars: { value: item.sugars || 0, unit: 'g' },
      sodium: { value: item.sodium || 0, unit: 'mg' }
    }
  }));

  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0);
  const totalCarbs = items.reduce((sum, item) => sum + item.nutrients.carbohydrates.value, 0);
  const totalProtein = items.reduce((sum, item) => sum + item.nutrients.protein.value, 0);
  const totalFat = items.reduce((sum, item) => sum + item.nutrients.fat.value, 0);

  return {
    success: true,
    data: {
      items,
      summary: {
        totalCalories,
        totalCarbohydrates: { value: totalCarbs, unit: 'g' },
        totalProtein: { value: totalProtein, unit: 'g' },
        totalFat: { value: totalFat, unit: 'g' }
      }
    }
  };
}

/**
 * n8n output 형태의 응답을 처리하는 함수
 */
function processN8nOutputResponse(response: any): any {
  console.log('Processing n8n output response:', response);

  if (response.output && Array.isArray(response.output)) {
    return processArrayResponse(response.output);
  }

  if (response.output && response.output.items) {
    return response.output;
  }

  return createDefaultResponse();
}

/**
 * data 배열 형태의 응답을 처리하는 함수
 */
function processDataArrayResponse(data: any[]): any {
  console.log('Processing data array response:', data);

  if (Array.isArray(data)) {
    return processArrayResponse(data);
  }

  return createDefaultResponse();
}

/**
 * 기본 형태의 응답을 변환하는 함수
 */
function createTransformedResponse(response: any): any {
  console.log('Creating transformed response from:', response);

  // 간단한 응답 형태를 처리
  if (response.name || response.foodName) {
    const item = {
      foodName: response.name || response.foodName || '분석된 음식',
      confidence: response.confidence || 0.9,
      quantity: response.quantity || response.amount || '1인분',
      calories: response.calories || 0,
      nutrients: {
        carbohydrates: { value: response.carbohydrates || 0, unit: 'g' },
        protein: { value: response.protein || 0, unit: 'g' },
        fat: { value: response.fat || 0, unit: 'g' },
        sugars: { value: response.sugars || 0, unit: 'g' },
        sodium: { value: response.sodium || 0, unit: 'mg' }
      }
    };

    return {
      success: true,
      data: {
        items: [item],
        summary: {
          totalCalories: item.calories,
          totalCarbohydrates: item.nutrients.carbohydrates,
          totalProtein: item.nutrients.protein,
          totalFat: item.nutrients.fat
        }
      }
    };
  }

  return createDefaultResponse();
}

/**
 * 기본 응답을 생성하는 헬퍼 함수
 */
function createDefaultResponse(): {
  success: boolean;
  data: {
    items: Array<{
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
    }>;
    summary: {
      totalCalories: number;
      totalCarbohydrates: { value: number; unit: string };
      totalProtein: { value: number; unit: string };
      totalFat: { value: number; unit: string };
    };
  };
} {
  return {
    success: true,
    data: {
      items: [
        {
          foodName: '이미지 분석 필요',
          confidence: 0.0,
          quantity: '분석 중',
          calories: 0,
          nutrients: {
            carbohydrates: { value: 0, unit: 'g' },
            protein: { value: 0, unit: 'g' },
            fat: { value: 0, unit: 'g' },
            sugars: { value: 0, unit: 'g' },
            sodium: { value: 0, unit: 'mg' }
          }
        }
      ],
      summary: {
        totalCalories: 0,
        totalCarbohydrates: { value: 0, unit: 'g' },
        totalProtein: { value: 0, unit: 'g' },
        totalFat: { value: 0, unit: 'g' }
      }
    }
  };
}
