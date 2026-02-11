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
      description: '고품질 PBN 네트워크 50개 배치 (도메인 직접 운영)',
    },
    {
      name: 'PBN 백링크 100',
      price: 570000,
      description: '고품질 PBN 네트워크 100개 배치 (강력한 순위 상승)',
    },
    {
      name: '플랜 백링크 20',
      price: 200000,
      description: '플랜 C 패키지 (20만 원) - 어드벤처 킷에 적합',
    },
    {
      name: '온페이지 SEO 점검',
      price: 200000,
      description: '메타태그/구조/콘텐츠 점검 리포트 제공',
    },
    {
      name: '콘텐츠 최적화 패키지',
      price: 300000,
      description: '키워드 기반 콘텐츠 수정 및 최적화',
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
    const { error } = await supabase
      .from('products')
      .update({
        price: item.price,
        description: item.description,
        updated_at: new Date().toISOString(),
      })
      .eq('name', item.name)

    if (error) {
      console.error(`상품 업데이트 실패 (${item.name}):`, error.message)
      continue
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
