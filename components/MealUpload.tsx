'use client';

import { useState, useRef, useTransition } from 'react';
import { uploadMealAction, saveMealRecord } from '@/app/actions/upload-meal';

interface AnalysisResult {
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
  mealType: string;
  analyzedAt: string;
}

export function MealUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
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

    // 임시 익명 사용자 ID 생성 (로그인 없이도 사용 가능)
    const userId = `anonymous-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    formData.append('userId', userId);
    console.log('Anonymous User ID being sent:', userId);

    startTransition(async () => {
      try {
        const result = await uploadMealAction(formData);

        if (result.success) {
          // 분석 결과를 상태에 저장
          setAnalysisResult(result.data);
          setShowAnalysis(true);
          setIsUploading(false);

          // 실제 데이터베이스 저장은 분석 결과 확인 후 사용자가 버튼을 누를 때 수행
          console.log('분석 완료:', result.data);
        } else {
          alert(result.error?.message || '업로드 중 오류가 발생했습니다.');
          setIsUploading(false);
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.');
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">🍽️ 식단 기록하기</h3>
        <p className="text-gray-600">음식 사진을 업로드하면 AI가 자동으로 분석합니다</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
          ${preview ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
          ${isUploading || isPending ? 'pointer-events-none opacity-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={showAnalysis ? undefined : handleButtonClick}
        style={{ cursor: showAnalysis ? 'default' : 'pointer' }}
      >
        {showAnalysis ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-lg font-medium text-green-800 mb-2">분석 완료!</p>
              <p className="text-gray-600">아래에서 상세 결과를 확인하세요</p>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full max-h-64 mx-auto rounded-lg shadow-sm"
            />
            <p className="text-sm text-gray-600">분석을 시작하려면 업로드 버튼을 클릭하세요</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">📷</span>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">사진을 여기에 끌어다 놓거나</p>
              <p className="text-gray-600">클릭하여 파일을 선택하세요</p>
            </div>
            <p className="text-sm text-gray-500">JPG, PNG, WEBP 지원 • 최대 10MB</p>
          </div>
        )}
      </div>

      {(isUploading || isPending) && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-3 px-4 py-3 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            <span className="text-blue-700 font-medium">
              {preview ? 'AI가 식단을 분석하고 있습니다...' : '업로드 중...'}
            </span>
          </div>
        </div>
      )}

      {/* 분석 완료 후 메시지 */}
      {showAnalysis && !isUploading && !isPending && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-3 px-4 py-3 bg-green-50 rounded-lg">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <span className="text-green-700 font-medium">
              분석이 완료되었습니다! 아래 결과를 확인해주세요
            </span>
          </div>
        </div>
      )}

      {/* 분석 결과 표시 */}
      {showAnalysis && analysisResult && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xl">✅</span>
            </div>
            <h3 className="text-xl font-bold text-green-800">분석 완료!</h3>
          </div>

          {/* 분석된 음식 목록 */}
          <div className="space-y-3 mb-6">
            {analysisResult.items.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{item.foodName}</h4>
                  <span className="text-sm text-gray-500">{item.quantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">{item.calories} kcal</span>
                  <span className="text-sm text-gray-500">
                    정확도: {Math.round(item.confidence * 100)}%
                  </span>
                </div>

                {/* 영양 정보 */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-700">탄수화물</div>
                    <div>{item.nutrients.carbohydrates.value}{item.nutrients.carbohydrates.unit}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-semibold text-red-700">단백질</div>
                    <div>{item.nutrients.protein.value}{item.nutrients.protein.unit}</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-semibold text-yellow-700">지방</div>
                    <div>{item.nutrients.fat.value}{item.nutrients.fat.unit}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 끼니 정보 */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🍽️</span>
                </div>
                <div>
                  <div className="font-semibold text-blue-800">끼니 분류</div>
                  <div className="text-sm text-blue-600">{analysisResult.mealType}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">분석 시간</div>
                <div className="text-sm font-medium text-gray-700">
                  {new Date(analysisResult.analyzedAt).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 총합계 */}
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h4 className="font-bold text-gray-900 mb-3 text-center">총 영양 정보</h4>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{analysisResult.summary.totalCalories}</div>
                <div className="text-sm text-gray-600">총 칼로리</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-500">{analysisResult.summary.totalCarbohydrates.value}{analysisResult.summary.totalCarbohydrates.unit}</div>
                <div className="text-sm text-gray-600">탄수화물</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-red-500">{analysisResult.summary.totalProtein.value}{analysisResult.summary.totalProtein.unit}</div>
                <div className="text-sm text-gray-600">단백질</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-yellow-500">{analysisResult.summary.totalFat.value}{analysisResult.summary.totalFat.unit}</div>
                <div className="text-sm text-gray-600">지방</div>
              </div>
            </div>
          </div>

          {/* 확인 버튼들 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setShowAnalysis(false);
                setAnalysisResult(null);
                setPreview(null);
              }}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              다시 촬영하기
            </button>
            <button
              onClick={async () => {
                try {
                  // 데이터베이스에 저장
                  const saveResult = await saveMealRecord(analysisResult);

                  if (saveResult.success) {
                    alert('🎉 식단 기록이 성공적으로 저장되었습니다!');
                    // 대시보드로 이동
                    window.location.href = '/dashboard';
                  } else {
                    alert(saveResult.error?.message || '저장 중 오류가 발생했습니다.');
                  }
                } catch (error) {
                  alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.');
                }
              }}
              className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              기록 저장하기
            </button>
          </div>
        </div>
      )}

      {/* 기존 기능들 (분석 결과가 없을 때만 표시) */}
      {!showAnalysis && (
        <div className="mt-6 text-center">
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-lg mb-1">🤖</span>
              <span>AI 분석</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-lg mb-1">⏰</span>
              <span>자동 분류</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-lg mb-1">📊</span>
              <span>영양 정보</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
