'use client'

import { useState, useEffect } from 'react'

const steps = [
  { label: '사이트 접속 확인', duration: 3000 },
  { label: '메타태그 및 HTML 구조 분석', duration: 5000 },
  { label: '페이지 속도 및 Core Web Vitals 측정', duration: 6000 },
  { label: '내부 링크 및 이미지 점검', duration: 4000 },
  { label: 'SEO 전문가 AI 분석 보고서 생성', duration: 7000 },
  { label: '이메일 발송 준비', duration: 3000 },
]

export default function AnalysisProgress() {
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (currentStep >= steps.length) {
      setDone(true)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, steps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {done ? (
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {done ? '분석이 곧 완료됩니다' : '사이트 분석 중...'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {done
              ? '가입하신 이메일로 상세 보고서를 발송합니다'
              : '47개 항목을 정밀 점검하고 있습니다'}
          </p>
        </div>
      </div>

      {/* 단계별 진행 */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            {/* 상태 아이콘 */}
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              {i < currentStep ? (
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : i === currentStep ? (
                <div className="w-3 h-3 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}
            </div>
            {/* 라벨 */}
            <span
              className={`text-sm ${
                i < currentStep
                  ? 'text-green-600 dark:text-green-400'
                  : i === currentStep
                    ? 'text-blue-600 dark:text-blue-400 font-medium'
                    : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
