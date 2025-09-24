# Phase 4: n8n 자동화 워크플로우 - 상세 Task

## 4.1 n8n 시간 기반 끼니 자동 분류 워크플로우

### 4.1.1 시간 기반 분류 로직 구현
- [ ] **Set 노드에서 시간 기반 분류 구현**
  ```javascript
  // 현재 시간 가져오기 (서버 시간)
  const now = new Date();

  // 시간대별 끼니 분류 (PRD 62-67)
  let mealType;
  const hour = now.getHours();

  if (hour >= 4 && hour < 11) {
    mealType = '아침';
  } else if (hour >= 11 && hour < 17) {
    mealType = '점심';
  } else if (hour >= 17 && hour < 22) {
    mealType = '저녁';
  } else {
    mealType = '간식';
  }

  return { mealType, timestamp: now.toISOString() };
  ```

- [ ] **시간대 규칙 설정**
  - 아침: 04:00 ~ 10:59
  - 점심: 11:00 ~ 16:59
  - 저녁: 17:00 ~ 21:59
  - 간식: 22:00 ~ 03:59

### 4.1.2 데이터 검증 및 처리
- [ ] **웹훅 데이터 유효성 검증**
  - 이미지 파일 존재 확인
  - userId 파라미터 검증
  - 파일 형식 검증 (image/jpeg, image/png 등)

- [ ] **mealType 변수 생성 및 전달**
  - 워크플로우 전역 변수로 mealType 설정
  - 후속 노드에서 mealType 사용
  - 로그 기록용 메타데이터 추가

## 4.2 n8n AI 식품 분석 통합

### 4.2.1 외부 AI 서비스 연동
- [ ] **HTTP Request 노드 설정**
  - AI 식품 분석 API 엔드포인트 설정
  - 인증 헤더 설정 (API 키 등)
  - 요청 타임아웃 설정 (30초)

- [ ] **AI 분석 요청 데이터 구성**
  ```javascript
  // 이미지 파일을 base64로 인코딩
  const imageBuffer = await fs.readFile($binary.image.data);
  const base64Image = imageBuffer.toString('base64');

  return {
    image: base64Image,
    format: 'base64',
    // 추가 분석 옵션들
    include_nutrients: true,
    confidence_threshold: 0.8
  };
  ```

### 4.2.2 분석 결과 처리 및 파싱
- [ ] **응답 데이터 파싱**
  ```javascript
  // AI 분석 결과 처리
  const analysis = $json;

  // 음식 아이템들 변환
  const items = analysis.foods.map(food => ({
    foodName: food.name,
    confidence: food.confidence,
    quantity: food.quantity || '1인분',
    calories: food.calories || 0,
    nutrients: {
      carbohydrates: food.nutrients.carbohydrates || { value: 0, unit: 'g' },
      protein: food.nutrients.protein || { value: 0, unit: 'g' },
      fat: food.nutrients.fat || { value: 0, unit: 'g' },
      sugars: food.nutrients.sugars || { value: 0, unit: 'g' },
      sodium: food.nutrients.sodium || { value: 0, unit: 'mg' }
    }
  }));

  // 전체 요약 계산
  const summary = items.reduce((acc, item) => ({
    totalCalories: acc.totalCalories + item.calories,
    totalCarbohydrates: acc.totalCarbohydrates + (item.nutrients.carbohydrates.value || 0),
    totalProtein: acc.totalProtein + (item.nutrients.protein.value || 0),
    totalFat: acc.totalFat + (item.nutrients.fat.value || 0)
  }), { totalCalories: 0, totalCarbohydrates: 0, totalProtein: 0, totalFat: 0 });

  return { items, summary, rawAnalysis: analysis };
  ```

- [ ] **신뢰도(confidence) 임계값 설정**
  - 기본 임계값: 0.8 (80%)
  - 낮은 신뢰도 아이템 필터링
  - 사용자에게 알림 메시지 설정

## 4.3 n8n Supabase 저장 및 연동 워크플로우

### 4.3.1 Supabase Storage 연동
- [ ] **이미지 파일 Supabase Storage 업로드**
  ```javascript
  // 이미지 파일을 Supabase Storage에 업로드
  const fileName = `${$json.userId}/${Date.now()}-${$binary.image.fileName}`;

  // Supabase Storage에 업로드
  const uploadResult = await supabase.storage
    .from('meal-images')
    .upload(fileName, $binary.image.data, {
      contentType: $binary.image.mimeType,
      cacheControl: '3600'
    });

  if (uploadResult.error) {
    throw new Error(`Storage upload failed: ${uploadResult.error.message}`);
  }

  // 공개 URL 생성
  const { data: { publicUrl } } = supabase.storage
    .from('meal-images')
    .getPublicUrl(fileName);

  return { imageUrl: publicUrl, fileName };
  ```

### 4.3.2 Database 저장 로직
- [ ] **food_logs 테이블에 데이터 삽입**
  ```javascript
  // 최종 데이터 구성
  const foodLogData = {
    user_id: $json.userId,
    meal_type: $json.mealType,
    image_url: $json.imageUrl,
    items: $json.items,
    summary: {
      totalCalories: $json.summary.totalCalories,
      totalCarbohydrates: $json.summary.totalCarbohydrates,
      totalProtein: $json.summary.totalProtein,
      totalFat: $json.summary.totalFat
    },
    created_at: new Date().toISOString()
  };

  // Supabase에 저장
  const { data, error } = await supabase
    .from('food_logs')
    .insert([foodLogData])
    .select();

  if (error) {
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return { success: true, data: data[0] };
  ```

- [ ] **트랜잭션 처리**
  - Storage 업로드와 DB 저장의 원자성 보장
  - 실패 시 롤백 처리
  - 부분 성공 시 정리 로직

### 4.3.3 에러 발생 시 롤백 처리
- [ ] **에러 핸들링 및 정리**
  ```javascript
  // 에러 발생 시 처리
  try {
    // 주요 작업들 실행
    const imageResult = await uploadImage();
    const analysisResult = await analyzeImage();
    const dbResult = await saveToDatabase();

    return { success: true, data: dbResult.data };
  } catch (error) {
    // 실패 시 정리 작업
    if (imageResult?.fileName) {
      await supabase.storage.from('meal-images').remove([imageResult.fileName]);
    }

    // 에러 응답 반환
    return {
      success: false,
      error: {
        code: error.code || 'PROCESSING_FAILED',
        message: error.message || '식단 분석 처리 중 오류가 발생했습니다.'
      }
    };
  }
  ```

## 4.4 성공/실패 응답 처리

### 4.4.1 성공 응답 구성
- [ ] **PRD 명세에 따른 응답 형식 구현**
  ```javascript
  // 성공 시 응답 (PRD 78-132)
  return {
    success: true,
    data: {
      items: $json.items, // 분석된 음식 목록
      summary: $json.summary // 전체 요약 정보
    }
  };
  ```

### 4.4.2 실패 응답 구성
- [ ] **PRD 명세에 따른 에러 응답 구현**
  ```javascript
  // 실패 시 응답 (PRD 135-142)
  return {
    success: false,
    error: {
      code: 'NO_FOOD_DETECTED', // 또는 다른 에러 코드
      message: '이미지에서 음식을 찾을 수 없습니다. 다른 사진으로 시도해주세요.'
    }
  };
  ```

## 완료 조건

### 4.1 n8n 시간 기반 끼니 자동 분류 워크플로우 완료
- [ ] 시간 기반 끼니 분류 로직이 정상 동작함
- [ ] 4개 시간대(아침/점심/저녁/간식)가 올바르게 분류됨
- [ ] mealType 변수가 후속 워크플로우에서 사용됨

### 4.2 n8n AI 식품 분석 통합 완료
- [ ] 외부 AI 서비스와 연동됨
- [ ] 분석 결과가 올바르게 파싱됨
- [ ] 신뢰도 임계값이 적용됨
- [ ] 영양 정보가 정확하게 처리됨

### 4.3 n8n Supabase 저장 및 연동 워크플로우 완료
- [ ] 이미지 파일이 Supabase Storage에 업로드됨
- [ ] food_logs 테이블에 데이터가 저장됨
- [ ] 트랜잭션 처리와 롤백이 동작함
- [ ] 성공/실패 응답이 올바른 형식으로 반환됨

## 다음 단계 의존성

Phase 4 완료 → Phase 5 (사용자 인터페이스)

## 참고 자료
- [n8n HTTP Request 노드](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httpRequest/)
- [n8n Set 노드](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.set/)
- [n8n Code 노드](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.code/)
- [Supabase Storage API](https://supabase.com/docs/guides/storage)
- [Supabase Database API](https://supabase.com/docs/guides/database)
