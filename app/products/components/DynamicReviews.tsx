'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// 업종/키워드 카테고리별 후기 풀
const reviewPool: Record<string, { name: string; role: string; text: string }[]> = {
  병원: [
    {
      name: '이**',
      role: '정형외과 원장',
      text: 'PBN 백링크 구축 후 4주 만에 주요 키워드가 구글 1페이지에 진입했습니다. 같은 지역 경쟁 병원보다 먼저 노출되니 신규 환자가 눈에 띄게 늘었어요.',
    },
    {
      name: '최**',
      role: '피부과 마케팅 담당',
      text: '온페이지 점검에서 메타태그 문제를 잡아줬는데, 수정 후 CTR이 35% 올랐습니다. 경쟁 병원들은 아직 이런 부분을 신경 못 쓰더라고요.',
    },
  ],
  쇼핑몰: [
    {
      name: '장**',
      role: '쇼핑몰 대표',
      text: '제품 페이지에 백링크를 걸었더니 3주 만에 검색 유입이 2배로 늘었습니다. 경쟁 쇼핑몰보다 먼저 상위에 올라갈 수 있었어요.',
    },
    {
      name: '한**',
      role: '이커머스 마케터',
      text: 'SEO 점검 보고서 보고 구조화 데이터를 추가했더니 리치 스니펫이 노출되기 시작했습니다. 경쟁사 대비 클릭률이 확 차이 납니다.',
    },
  ],
  부동산: [
    {
      name: '김**',
      role: '공인중개사',
      text: '지역 키워드 검색에서 우리 사무소가 1페이지에 나오니까 전화 문의가 확 늘었습니다. 주변 중개사들이 어떻게 한 거냐고 물어볼 정도예요.',
    },
    {
      name: '박**',
      role: '부동산 컨설턴트',
      text: '백링크 50개 구축 후 경쟁 업체보다 먼저 구글에 노출되고 있어요. 이 차이가 매출로 바로 연결됩니다.',
    },
  ],
  default: [
    {
      name: '김**',
      role: '스타트업 대표',
      text: 'PBN 백링크 구축 후 3주 만에 메인 키워드가 2페이지에서 1페이지로 올라왔습니다. 경쟁사보다 먼저 올라가서 트래픽이 크게 늘었어요.',
    },
    {
      name: '박**',
      role: '마케팅 매니저',
      text: 'SEO 점검 보고서가 정말 상세해서 놀랐습니다. 메타태그 하나 수정했을 뿐인데 CTR이 40% 올랐어요. 경쟁사는 아직 이런 기본적인 것도 안 되어 있더라고요.',
    },
  ],
}

// 키워드에서 업종 추정
function detectCategory(keyword: string): string {
  const lower = keyword.toLowerCase()
  if (/병원|의원|클리닉|치과|피부과|정형외과|성형|한의원|안과/.test(lower)) return '병원'
  if (/쇼핑몰|쇼핑|구매|판매|제품|상품|스토어|마켓/.test(lower)) return '쇼핑몰'
  if (/부동산|아파트|매매|중개|전세|월세|분양/.test(lower)) return '부동산'
  return 'default'
}

function ReviewContent() {
  const searchParams = useSearchParams()
  const site = searchParams.get('site') || ''

  // 도메인에서 키워드 힌트 추출
  const keyword = site
    ? decodeURIComponent(site)
        .replace(/https?:\/\//, '')
        .replace(/www\./, '')
        .split(/[./]/)[0]
    : ''

  const category = keyword ? detectCategory(keyword) : 'default'
  const reviews = reviewPool[category] || reviewPool.default

  return (
    <div className="space-y-3">
      {reviews.map((review, i) => (
        <div key={i} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-yellow-400 text-sm">★★★★★</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {review.name} {review.role}
            </span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">&ldquo;{review.text}&rdquo;</p>
        </div>
      ))}
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
        비슷한 키워드로 이미 성과를 내고 있는 고객들이 있습니다
      </p>
    </div>
  )
}

export default function DynamicReviews() {
  return (
    <Suspense fallback={<div className="h-32" />}>
      <ReviewContent />
    </Suspense>
  )
}
