// v1.0 - FAQ 아코디언 컴포넌트 (2026-02-10)
/**
 * FAQ 아코디언 - 접기/펴기 기능
 * - 클라이언트 컴포넌트로 상태 관리
 * - 한 번에 하나씩만 열리도록 구현
 * - 부드러운 애니메이션 효과
 */
'use client'

import { useState } from 'react'

// FAQ 데이터 타입
interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  borderColor: string
}

// FAQ 데이터 (핵심 6개만 선별)
const faqData: FAQItem[] = [
  {
    id: 1,
    category: '서비스 차별화',
    borderColor: 'border-blue-500',
    question: '일반 백링크 업체와 백링크샵의 차이는 무엇인가요?',
    answer:
      '백링크샵은 100% 자체 인프라를 운영합니다. 95%의 업체는 KWORK/FIVERR에서 저렴한 스팸 SEO를 $5~20에 구매해 재판매하지만, 백링크샵은 직접 구축·운영하는 PBN과 10가지 이상 백링크 유형을 보유했습니다. 주문 즉시 10분 내 작업이 자동으로 시작되며, 완료 후에는 상세한 엑셀 리포트를 제공합니다. 중간 마진 없이 순수한 가격으로 제공합니다.',
  },
  {
    id: 2,
    category: '안전성',
    borderColor: 'border-yellow-500',
    question: 'PBN이 안전한가요?',
    answer:
      '네, 고품질 PBN은 매우 안전합니다. 저품질 PBN이 위험한 이유는 같은 IP, 같은 호스팅, 스팸 콘텐츠 때문입니다. 백링크샵은 각 사이트를 서로 다른 호스팅, 다양한 IP, 고유한 콘텐츠로 운영하며, 자연스러운 분산 링킹으로 패널티 위험을 제로로 만듭니다. 지난 3년간 1,247개 프로젝트에서 패널티 사례 0건을 기록 중입니다.',
  },
  {
    id: 3,
    category: '효과',
    borderColor: 'border-cyan-500',
    question: '백링크 효과는 언제부터 나타나나요?',
    answer:
      '평균 2-4주 내에 초기 순위 변화가 나타납니다. 의류 쇼핑몰 A사는 3주 만에 47위에서 3위로 상승했고, 치과 클리닉 B는 5주 만에 검색 안 되던 상태에서 7위로 진입했습니다. 마케팅 툴 C사는 4주 만에 23위에서 2위로 올랐습니다. 단, 경쟁 강도에 따라 3-6개월에 걸쳐 안정적으로 상승하며, 한 번 오른 순위는 지속적으로 유지됩니다.',
  },
  {
    id: 4,
    category: '가격',
    borderColor: 'border-orange-500',
    question: '소량으로 테스트할 수 있나요?',
    answer:
      '네, 가입 시 무료 20만 크레딧을 제공합니다. 20만 크레딧으로 온페이지 SEO 점검을 무료로 받아보실 수 있습니다. 리스크 없이 우리의 품질을 먼저 경험해보세요. 만족하시면 그때 결제하시면 되며, 98%의 고객이 재구매합니다.',
  },
  {
    id: 5,
    category: '프로세스',
    borderColor: 'border-violet-500',
    question: '주문 후 얼마나 빨리 시작되나요?',
    answer:
      '주문 즉시 10분 내 자동으로 작업이 시작됩니다. 수동 처리가 아닌 자동화 시스템으로 운영되어, 결제 완료 후 10분 이내에 백링크 작업이 진행됩니다. 대시보드에서 실시간 진행 상황을 확인할 수 있으며, 작업 완료 시 이메일 알림과 함께 상세 엑셀 리포트(URL, 앵커 텍스트 등)를 제공합니다.',
  },
  {
    id: 6,
    category: '환불',
    borderColor: 'border-rose-500',
    question: '환불이 가능한가요?',
    answer:
      '네, 작업 미진행 시 100% 환불, 효과 없을 시 부분 환불이 가능합니다. 주문 후 작업 시작 전에는 100% 환불, 작업 완료 후 90일 내 순위 변화가 전혀 없으면 50% 환불해드립니다. 단, 사이트 수정 권장사항을 이행하지 않았거나, 구글 가이드라인 위반 사이트는 환불 대상에서 제외됩니다. 3년간 환불 요청 0.8%로 고객 만족도가 매우 높습니다.',
  },
]

export function FAQAccordion() {
  // 현재 열린 FAQ ID (null이면 모두 닫힘)
  const [openId, setOpenId] = useState<number | null>(null)

  // FAQ 토글 함수
  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {faqData.map(faq => (
        <div
          key={faq.id}
          className={`bg-white rounded-xl shadow-lg border-l-4 ${faq.borderColor} overflow-hidden transition-all hover:shadow-xl`}
        >
          {/* 질문 버튼 */}
          <button
            onClick={() => toggleFAQ(faq.id)}
            className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg">Q. {faq.question}</p>
            </div>
            {/* 화살표 아이콘 */}
            <div
              className={`flex-shrink-0 transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`}
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          {/* 답변 (접기/펴기) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openId === faq.id ? 'max-h-96' : 'max-h-0'
            }`}
          >
            <div className="px-6 pb-6 pt-0">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
