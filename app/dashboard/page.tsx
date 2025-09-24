'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MealUpload } from '@/components/MealUpload';
import { DailyMeals } from '@/components/DailyMeals';
import { DailySummary } from '@/components/DailySummary';

export default function DashboardPage() {
  const { user, loading, bypassLogin, signOut } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // 로그인되지 않은 경우 홈으로 리다이렉트
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleBypassLogin = () => {
    bypassLogin();
    setShowLoginPrompt(false);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (showLoginPrompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🍽️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">MealLog에 오신 것을 환영합니다!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            실제 서비스를 체험하시려면 로그인이 필요합니다.<br />
            개발 편의를 위해 임시 로그인을 제공합니다.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleBypassLogin}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              🚀 임시 로그인 (데모 체험)
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all"
            >
              홈으로 돌아가기
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            실제 서비스에서는 이메일/비밀번호로 로그인하실 수 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MealLog</h1>
                <p className="text-sm text-gray-500">내 식단 관리</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
                <p className="text-xs text-gray-500">환영합니다!</p>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            오늘도 건강한 식단 기록을 시작해보세요! 🎉
          </h2>
          <p className="text-gray-600">
            사진 한 장으로 모든 것이 완료됩니다. AI가 자동으로 분석하고 분류해드립니다.
          </p>
        </div>

        {/* Meal Upload Section */}
        <div className="mb-8">
          <MealUpload />
        </div>

        {/* Date Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">식단 기록 조회</h3>
              <div className="flex items-center space-x-4">
                <label htmlFor="date-select" className="text-sm font-medium text-gray-700">
                  날짜 선택:
                </label>
                <input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="mb-8">
          <DailySummary date={selectedDate} />
        </div>

        {/* Daily Meals */}
        <div className="mb-8">
          <DailyMeals date={selectedDate} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>💡 팁: 음식 사진을 업로드하면 AI가 자동으로 칼로리와 영양소를 분석합니다.</p>
            <p className="mt-2">⏰ 시간대에 따라 아침/점심/저녁/간식으로 자동 분류됩니다.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
