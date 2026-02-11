// v1.0 - 상품 가격/설명 업데이트 스크립트 (2026-02-11)
// 사용 예시: node scripts/update-product-prices.js

/* eslint-disable no-console */
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

/**
 * 환경변수 확인
 * 필수값이 없으면 에러 발생
 */
function validateEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      '환경변수가 누락되었습니다: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return { url, serviceKey }
}

/**
 * 업데이트할 상품 목록
 * - 1크레딧 = 1원 기준
 */
function getProductUpdates() {
  return [
    {
      name: 'PBN 백링크 50',
      price: 300000,
      description: '고품질 PBN 백링크 50개 구축 (도메인 직접 운영)',
      category: 'backlink',
      metadata: { da_range: '40-60', turnaround: '7일' },
    },
    {
      name: 'PBN 백링크 100',
      price: 570000,
      description: '고품질 PBN 백링크 100개 구축 (강력한 순위 상승)',
      category: 'backlink',
      metadata: { da_range: '40-70', turnaround: '10일' },
    },
    {
      name: '로직 업그레이드 PBN 50',
      price: 800000,
      description: '로직 업그레이드 PBN 백링크 50개 구축 (고유 도메인 사용)',
      category: 'backlink',
      metadata: { da_range: '50-80', turnaround: '10일' },
    },
    {
      name: '로직 업그레이드 PBN 100',
      price: 1500000,
      description: '로직 업그레이드 PBN 백링크 100개 구축 (콘텐츠 업데이트 포함)',
      category: 'backlink',
      metadata: { da_range: '50-80', turnaround: '14일' },
    },
    {
      name: '로직 업그레이드 PBN 200',
      price: 2500000,
      description: '로직 업그레이드 PBN 백링크 200개 구축 (강력한 링크 파워)',
      category: 'backlink',
      metadata: { da_range: '50-90', turnaround: '21일' },
    },
    {
      name: '로직 업그레이드 PBN 500',
      price: 4500000,
      description: '로직 업그레이드 PBN 백링크 500개 구축 (초고경쟁 키워드)',
      category: 'backlink',
      metadata: { da_range: '50-90', turnaround: '30일' },
    },
    {
      name: '플랜 백링크 20',
      price: 200000,
      description: '플랜 C 패키지 (20만 원) - 어드벤처 킷에 적합',
      category: 'backlink',
      metadata: { da_range: '20-40', turnaround: '5일' },
    },
    {
      name: '플랜 백링크 B',
      price: 600000,
      description: '플랜 B 패키지 (60만 원) - 검색량 높은 키워드에 적합',
      category: 'backlink',
      metadata: { da_range: '20-50', turnaround: '10일' },
    },
    {
      name: '플랜 백링크 A',
      price: 1150000,
      description: '플랜 A 패키지 (115만 원) - 경쟁 키워드 성과 중심',
      category: 'backlink',
      metadata: { da_range: '30-60', turnaround: '14일' },
    },
    {
      name: '플랜 백링크 S',
      price: 2100000,
      description: '플랜 S 패키지 (210만 원) - 고경쟁 키워드 맞춤',
      category: 'backlink',
      metadata: { da_range: '30-70', turnaround: '21일' },
    },
    {
      name: '온페이지 SEO 점검',
      price: 200000,
      description: '메타태그/구조/콘텐츠 점검 리포트 제공',
      category: 'seo',
      metadata: { turnaround: '3일' },
    },
    {
      name: '콘텐츠 최적화 패키지',
      price: 300000,
      description: '키워드 기반 콘텐츠 수정 및 최적화',
      category: 'content',
      metadata: { turnaround: '4일' },
    },
  ]
}

/**
 * 상품 업데이트 실행
 */
async function updateProducts() {
  const { url, serviceKey } = validateEnv()
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  })

  const updates = getProductUpdates()
  let updatedCount = 0

  for (const item of updates) {
    const { data: existing, error: existError } = await supabase
      .from('products')
      .select('id')
      .eq('name', item.name)
      .maybeSingle()

    if (existError) {
      console.error(`상품 조회 실패 (${item.name}):`, existError.message)
      continue
    }

    if (existing?.id) {
      const { error } = await supabase
        .from('products')
        .update({
          price: item.price,
          description: item.description,
          metadata: item.metadata || {},
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) {
        console.error(`상품 업데이트 실패 (${item.name}):`, error.message)
        continue
      }
    } else {
      const { error } = await supabase.from('products').insert({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category || 'backlink',
        status: 'active',
        metadata: item.metadata || {},
      })

      if (error) {
        console.error(`상품 추가 실패 (${item.name}):`, error.message)
        continue
      }
    }

    updatedCount += 1
  }

  console.log(`상품 ${updatedCount}개 업데이트 완료`)
}

/**
 * 실행 엔트리 포인트
 */
async function main() {
  try {
    await updateProducts()
    process.exit(0)
  } catch (error) {
    console.error('상품 업데이트 실패:', error.message || error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
