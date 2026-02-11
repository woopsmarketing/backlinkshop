// v1.0 - 기본 상품 시드 추가 (2026-02-05)
// 사용 예시: node scripts/seed-products.js
// 목적: 테스트용 기본 상품 데이터를 DB에 삽입

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
 * 기본 상품 목록
 * 필요시 여기서 수정 가능
 */
function getSeedProducts() {
  return [
    {
      name: 'PBN 백링크 50',
      description: '고품질 PBN 백링크 50개 구축 (도메인 직접 운영)',
      price: 300000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '40-60', turnaround: '7일' },
    },
    {
      name: 'PBN 백링크 100',
      description: '고품질 PBN 백링크 100개 구축 (강력한 순위 상승)',
      price: 570000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '40-70', turnaround: '10일' },
    },
    {
      name: '로직 업그레이드 PBN 50',
      description: '로직 업그레이드 PBN 백링크 50개 구축 (고유 도메인 사용)',
      price: 800000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '50-80', turnaround: '10일' },
    },
    {
      name: '로직 업그레이드 PBN 100',
      description: '로직 업그레이드 PBN 백링크 100개 구축 (콘텐츠 업데이트 포함)',
      price: 1500000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '50-80', turnaround: '14일' },
    },
    {
      name: '로직 업그레이드 PBN 200',
      description: '로직 업그레이드 PBN 백링크 200개 구축 (강력한 링크 파워)',
      price: 2500000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '50-90', turnaround: '21일' },
    },
    {
      name: '로직 업그레이드 PBN 500',
      description: '로직 업그레이드 PBN 백링크 500개 구축 (초고경쟁 키워드)',
      price: 4500000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '50-90', turnaround: '30일' },
    },
    {
      name: '플랜 백링크 20',
      description: '플랜 C 패키지 (20만 원) - 어드벤처 킷에 적합',
      price: 200000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '20-40', turnaround: '5일' },
    },
    {
      name: '플랜 백링크 B',
      description: '플랜 B 패키지 (60만 원) - 검색량 높은 키워드에 적합',
      price: 600000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '20-50', turnaround: '10일' },
    },
    {
      name: '플랜 백링크 A',
      description: '플랜 A 패키지 (115만 원) - 경쟁 키워드 성과 중심',
      price: 1150000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '30-60', turnaround: '14일' },
    },
    {
      name: '플랜 백링크 S',
      description: '플랜 S 패키지 (210만 원) - 고경쟁 키워드 맞춤',
      price: 2100000,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '30-70', turnaround: '21일' },
    },
    {
      name: '온페이지 SEO 점검',
      description: '메타태그/구조/콘텐츠 점검 리포트 제공',
      price: 200000,
      category: 'seo',
      status: 'active',
      metadata: { turnaround: '3일' },
    },
    {
      name: '콘텐츠 최적화 패키지',
      description: '키워드 기반 콘텐츠 수정 및 최적화',
      price: 300000,
      category: 'content',
      status: 'active',
      metadata: { turnaround: '4일' },
    },
  ]
}

/**
 * 상품 시드 실행
 * 중복 이름이 있으면 건너뜀
 */
async function seedProducts() {
  const { url, serviceKey } = validateEnv()

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  })

  const products = getSeedProducts()
  const names = products.map(item => item.name)

  // 기존 상품 확인 (이름 기준)
  const { data: existing, error: existError } = await supabase
    .from('products')
    .select('name')
    .in('name', names)

  if (existError) {
    throw new Error(`기존 상품 조회 실패: ${existError.message}`)
  }

  const existingNames = new Set((existing || []).map(item => item.name))
  const newProducts = products.filter(item => !existingNames.has(item.name))

  if (newProducts.length === 0) {
    console.log('이미 모든 상품이 존재합니다. 추가 삽입 없음.')
    return
  }

  // 상품 삽입
  const { error: insertError } = await supabase.from('products').insert(newProducts)

  if (insertError) {
    throw new Error(`상품 삽입 실패: ${insertError.message}`)
  }

  console.log(`상품 ${newProducts.length}개가 성공적으로 추가되었습니다.`)
}

/**
 * 실행 엔트리 포인트
 */
async function main() {
  try {
    await seedProducts()
    process.exit(0)
  } catch (error) {
    console.error('상품 시드 실패:', error.message || error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
