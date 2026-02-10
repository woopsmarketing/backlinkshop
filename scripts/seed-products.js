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
    throw new Error('환경변수가 누락되었습니다: NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY')
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
      description: 'DA 높은 PBN 네트워크 50개 배치',
      price: 500,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '40-60', turnaround: '7일' },
    },
    {
      name: '플랜 백링크 20',
      description: '외부 사이트 20개에 백링크 구축',
      price: 200,
      category: 'backlink',
      status: 'active',
      metadata: { da_range: '20-40', turnaround: '5일' },
    },
    {
      name: '온페이지 SEO 점검',
      description: '메타태그/구조/콘텐츠 점검 리포트 제공',
      price: 300,
      category: 'seo',
      status: 'active',
      metadata: { turnaround: '3일' },
    },
    {
      name: '콘텐츠 최적화 패키지',
      description: '키워드 기반 콘텐츠 수정 및 최적화',
      price: 400,
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
  const names = products.map((item) => item.name)

  // 기존 상품 확인 (이름 기준)
  const { data: existing, error: existError } = await supabase
    .from('products')
    .select('name')
    .in('name', names)

  if (existError) {
    throw new Error(`기존 상품 조회 실패: ${existError.message}`)
  }

  const existingNames = new Set((existing || []).map((item) => item.name))
  const newProducts = products.filter((item) => !existingNames.has(item.name))

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

