'use client';

import { useState } from 'react';

export default function Home() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleDemoClick = () => {
    setIsDemoMode(true);
    // 임시로 대시보드 페이지로 이동 (나중에 실제 구현)
    alert('데모 모드입니다! 실제 서비스에서는 식단 기록과 분석 기능을 체험하실 수 있습니다.');
  };

  const handleLoginClick = () => {
    // 임시 로그인 (나중에 실제 구현)
    alert('로그인 기능은 개발 중입니다. 데모 버튼을 클릭하여 기능을 체험해보세요!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <span className="font-bold text-xl text-gray-900">MealLog</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인
              </button>
              <button
                onClick={handleDemoClick}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                데모 체험하기
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              식단 기록의
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent block">
                새로운 기준
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              <strong className="text-gray-900">단 하나의 클릭</strong>으로 식단 기록의 모든 것을 완료하세요.<br />
              번거로운 입력은 이제 그만, <strong className="text-blue-600">AI가 모든 것을 자동으로 처리합니다.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleDemoClick}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center">
                  📸 지금 시작하기
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                더 알아보기 ↓
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📱</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">사진 한 장</h3>
                  <p className="text-gray-600 text-sm">그냥 사진만 찍으세요</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">AI 분석</h3>
                  <p className="text-gray-600 text-sm">나머지는 AI가 처리합니다</p>
                </div>
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">완성된 기록</h3>
                  <p className="text-gray-600 text-sm">끼니별로 자동 분류됩니다</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              왜 MealLog인가요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              기존 식단 기록 앱들의 불편함을 해결하고, 진짜 사용하고 싶은 서비스를 만들었습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">번개처럼 빠른 기록</h3>
              <p className="text-gray-600 leading-relaxed">
                사진 한 장이면 끝입니다. 칼로리 계산, 영양 분석, 끼니 분류까지 AI가 모두 처리합니다.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">똑똑한 자동 분류</h3>
              <p className="text-gray-600 leading-relaxed">
                업로드 시간을 기준으로 아침, 점심, 저녁, 간식을 자동으로 분류합니다. 더 이상 선택할 필요가 없습니다.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">상세한 영양 분석</h3>
              <p className="text-gray-600 leading-relaxed">
                탄수화물, 단백질, 지방 등 상세한 영양 정보를 제공합니다. 건강한 식습관을 위한 필수 정보입니다.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">📱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">모바일 최적화</h3>
              <p className="text-gray-600 leading-relaxed">
                언제 어디서나 모바일로 편리하게 사용할 수 있습니다. 반응형 디자인으로 모든 기기에서 완벽합니다.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">안전한 데이터 관리</h3>
              <p className="text-gray-600 leading-relaxed">
                Supabase를 통해 안전하게 데이터를 저장하고 관리합니다. 개인정보 보호를 최우선으로 합니다.
              </p>
            </div>

            <div className="p-8 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl border border-cyan-100 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">직관적인 대시보드</h3>
              <p className="text-gray-600 leading-relaxed">
                날짜별, 끼니별로 정리된 깔끔한 대시보드로 식단을 한눈에 파악할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              사용법은 간단합니다
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 설정이나 학습이 필요 없습니다. 누구나 3초 만에 사용할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">사진 촬영</h3>
              <p className="text-gray-600 leading-relaxed">
                먹은 음식 사진을 촬영하거나 갤러리에서 선택하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">업로드</h3>
              <p className="text-gray-600 leading-relaxed">
                사진을 업로드하면 AI가 자동으로 분석을 시작합니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">완성</h3>
              <p className="text-gray-600 leading-relaxed">
                끼니별로 자동 분류된 식단 기록이 완성됩니다
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-xl shadow-lg">
              <span className="text-2xl mr-4">⏱️</span>
              <span className="text-gray-900 font-semibold">총 소요 시간: 3초</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            복잡한 식단 기록은 이제 그만.<br />
            <strong className="text-white">MealLog</strong>와 함께 간편한 식단 관리를 시작해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDemoClick}
              className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 무료로 시작하기
            </button>
            <button
              onClick={handleLoginClick}
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all"
            >
              로그인하기
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-6">
            * 현재 베타 버전으로 제공되며, 모든 기능이 무료입니다
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🍽️</span>
                </div>
                <span className="font-bold text-xl">MealLog</span>
              </div>
              <p className="text-gray-300 leading-relaxed max-w-md">
                마찰 없는 식단 기록의 새로운 기준.<br />
                AI 기술로 여러분의 건강한 식습관을 응원합니다.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">서비스</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">식단 기록</a></li>
                <li><a href="#" className="hover:text-white transition-colors">영양 분석</a></li>
                <li><a href="#" className="hover:text-white transition-colors">대시보드</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">문의</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">고객 지원</a></li>
                <li><a href="#" className="hover:text-white transition-colors">개발자 문서</a></li>
                <li><a href="#" className="hover:text-white transition-colors">문의하기</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MealLog. 모든 권리 보유.</p>
          </div>
        </div>
      </footer>

      {/* Demo Mode Modal */}
      {isDemoMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 데모 모드</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              실제 서비스에서는 다음과 같은 기능을 체험하실 수 있습니다:<br /><br />
              • 사진으로 식단 기록<br />
              • AI 자동 분석<br />
              • 시간 기반 끼니 분류<br />
              • 상세한 영양 정보<br />
              • 개인별 대시보드
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDemoMode(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  alert('대시보드 페이지가 준비 중입니다! 곧 완성될 예정입니다.');
                  setIsDemoMode(false);
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                대시보드 보기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
