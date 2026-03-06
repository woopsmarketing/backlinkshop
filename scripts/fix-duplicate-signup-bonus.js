/**
 * 중복 가입 보너스 수정 스크립트
 *
 * 문제: Race Condition으로 인해 일부 사용자가 가입 보너스를 2번 받음
 * 해결: 중복 지급된 보너스를 찾아서 차감 기록 추가
 *
 * 실행 방법:
 * node scripts/fix-duplicate-signup-bonus.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

/**
 * 환경변수 확인
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
 * 중복 가입 보너스를 받은 사용자 찾기
 */
async function findDuplicateBonusUsers(supabase) {
  console.log('\n🔍 중복 가입 보너스 사용자 검색 중...\n')

  // 가입 보너스를 2번 이상 받은 사용자 찾기
  const { data, error } = await supabase
    .from('credit_ledger')
    .select('user_id, amount, created_at')
    .eq('reason', 'signup_bonus')
    .order('user_id')
    .order('created_at')

  if (error) {
    throw new Error(`조회 실패: ${error.message}`)
  }

  // 사용자별로 그룹화
  const userBonusMap = new Map()

  for (const record of data) {
    if (!userBonusMap.has(record.user_id)) {
      userBonusMap.set(record.user_id, [])
    }
    userBonusMap.get(record.user_id).push(record)
  }

  // 2번 이상 받은 사용자만 필터링
  const duplicateUsers = []
  for (const [userId, bonuses] of userBonusMap.entries()) {
    if (bonuses.length > 1) {
      duplicateUsers.push({
        userId,
        bonuses,
        duplicateCount: bonuses.length - 1,
        totalDuplicate: bonuses[0].amount * (bonuses.length - 1),
      })
    }
  }

  return duplicateUsers
}

/**
 * 중복 보너스 수정
 */
async function fixDuplicateBonus(supabase, userId, duplicateAmount) {
  console.log(`  → 사용자 ${userId.slice(0, 8)}... 수정 중...`)

  // 환불 기록 추가 (중복 지급분 차감)
  const { error } = await supabase.rpc('apply_credit_delta', {
    p_user_id: userId,
    p_amount: -duplicateAmount,
    p_reason: 'refund',
    p_ref_type: 'duplicate_bonus_fix',
    p_ref_id: new Date().toISOString(),
  })

  if (error) {
    console.error(`  ✗ 실패: ${error.message}`)
    return false
  }

  console.log(`  ✓ 성공: ${duplicateAmount} 크레딧 차감`)
  return true
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    console.log('='.repeat(60))
    console.log('중복 가입 보너스 수정 스크립트')
    console.log('='.repeat(60))

    // 1. 환경변수 확인
    const { url, serviceKey } = validateEnv()
    const supabase = createClient(url, serviceKey, {
      auth: { persistSession: false },
    })

    // 2. 중복 보너스 사용자 찾기
    const duplicateUsers = await findDuplicateBonusUsers(supabase)

    if (duplicateUsers.length === 0) {
      console.log('✅ 중복 가입 보너스를 받은 사용자가 없습니다.\n')
      return
    }

    console.log(`⚠️  총 ${duplicateUsers.length}명의 사용자가 중복 보너스를 받았습니다:\n`)

    // 3. 각 사용자별 정보 출력
    for (const user of duplicateUsers) {
      console.log(`사용자 ID: ${user.userId.slice(0, 8)}...`)
      console.log(`  - 중복 횟수: ${user.duplicateCount}회`)
      console.log(`  - 중복 금액: ${user.totalDuplicate.toLocaleString()} 크레딧`)
      console.log(`  - 지급 시각:`)
      user.bonuses.forEach((bonus, idx) => {
        console.log(`    ${idx + 1}. ${bonus.created_at}`)
      })
      console.log()
    }

    // 4. 수정 확인
    console.log('='.repeat(60))
    console.log('⚠️  주의: 이 작업은 크레딧을 차감합니다.')
    console.log('계속하려면 스크립트를 다시 실행하면서 --fix 옵션을 추가하세요.')
    console.log('예: node scripts/fix-duplicate-signup-bonus.js --fix')
    console.log('='.repeat(60))

    // --fix 옵션이 있으면 실제 수정 실행
    if (process.argv.includes('--fix')) {
      console.log('\n🔧 중복 보너스 수정 시작...\n')

      let successCount = 0
      let failCount = 0

      for (const user of duplicateUsers) {
        const success = await fixDuplicateBonus(supabase, user.userId, user.totalDuplicate)
        if (success) {
          successCount++
        } else {
          failCount++
        }
      }

      console.log('\n' + '='.repeat(60))
      console.log('✅ 수정 완료')
      console.log(`  - 성공: ${successCount}명`)
      console.log(`  - 실패: ${failCount}명`)
      console.log('='.repeat(60))
    }
  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message)
    process.exit(1)
  }
}

// 실행
main()
