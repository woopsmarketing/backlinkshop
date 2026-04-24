// v1.0 - 해피패스 E2E 테스트 (2026-02-05)
/**
 * 로그인 → 쿠폰 적용 → 상품 구매 → 주문 내역 확인
 */

import { test, expect } from '@playwright/test'
import {
  setupE2ESeed,
  teardownE2ESeed,
  hasOrderForProduct,
  type E2ESeedData,
} from '../helpers/e2e-seed'

let seed: E2ESeedData

test.describe('Happy Path: 로그인 → 쿠폰 → 구매 → 주문 확인', () => {
  test.beforeAll(async () => {
    seed = await setupE2ESeed()
  })

  test.afterAll(async () => {
    if (seed) {
      await teardownE2ESeed(seed)
    }
  })

  test('쿠폰 적용 후 상품 구매가 완료된다', async ({ page }) => {
    // 1) 로그인 페이지 이동
    await page.goto('/login')

    // 2) 로그인
    await page.fill('#email', seed.userEmail)
    await page.fill('#password', seed.userPassword)
    await page.getByRole('button', { name: '로그인' }).click()
    await page.waitForURL('**/dashboard', { timeout: 15000 })
    await expect(page.getByText('현재 잔액')).toBeVisible()

    // 3) 쿠폰 적용
    await page.goto('/credits')
    await page.fill('input[placeholder="쿠폰 코드 입력"]', seed.couponCode)
    await page.click('text=쿠폰 적용')
    await expect(page.getByText('크레딧이 지급되었습니다')).toBeVisible()

    // 4) 상품 구매
    await page.goto('/products')
    const productCard = page
      .getByRole('heading', { name: seed.productName })
      .locator('..')
      .locator('..')
    await productCard.getByRole('link', { name: '상품 보기' }).click()
    await page.waitForURL('**/products/**')
    await expect(page.getByText(seed.productName).first()).toBeVisible()
    await page.fill('input[type="number"]', '1')
    await Promise.all([
      page.waitForResponse(
        res => res.request().method() === 'POST' && res.url().includes('/products/')
      ),
      page.getByRole('button', { name: '구매하기' }).click(),
    ])
    await page.waitForTimeout(1000)

    // 실패 메시지 확인
    const possibleErrors = [
      '주문에 실패했습니다',
      '주문 생성에 실패했습니다',
      '크레딧이 부족합니다',
      '상품을 찾을 수 없습니다',
      '주문 처리 중 오류가 발생했습니다',
    ]

    for (const message of possibleErrors) {
      const visible = await page
        .getByText(message)
        .isVisible()
        .catch(() => false)
      if (visible) {
        throw new Error(`주문 오류: ${message}`)
      }
    }

    // 주문 생성 확인 (DB 조회)
    const start = Date.now()
    let created = false
    while (Date.now() - start < 10000) {
      created = await hasOrderForProduct(seed.userId, seed.productId)
      if (created) break
      await page.waitForTimeout(500)
    }

    if (!created) {
      throw new Error('주문이 생성되지 않았습니다')
    }

    // 주문 내역 확인
    await page.goto('/orders')
    await expect(page.getByText('대기중')).toBeVisible()
    await expect(page.getByText('500 크레딧')).toBeVisible()
  })
})
