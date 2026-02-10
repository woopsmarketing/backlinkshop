// v1.0 - 충전 요청 → 관리자 승인 E2E (2026-02-05)
/**
 * 유저 충전 요청 → 관리자 승인 → 잔액 증가 확인
 */

import { test, expect, type Page } from '@playwright/test'
import {
  setupTopupApprovalSeed,
  teardownTopupApprovalSeed,
  type TopupApprovalSeedData,
} from '../helpers/e2e-seed'

let seed: TopupApprovalSeedData

const TOPUP_PACKAGE_LABEL = '스타터'
const TOPUP_PACKAGE_ID = 'starter_300'
const TOPUP_AMOUNT = 300

test.describe('Topup Approval Flow', () => {
  test.beforeAll(async () => {
    seed = await setupTopupApprovalSeed()
  })

  test.afterAll(async () => {
    if (seed) {
      await teardownTopupApprovalSeed(seed)
    }
  })

  test('유저 충전 요청 후 관리자 승인 시 잔액이 증가한다', async ({ browser }) => {
    const userContext = await browser.newContext()
    const adminContext = await browser.newContext()
    const userPage = await userContext.newPage()
    const adminPage = await adminContext.newPage()

    // 1) 유저 로그인 후 충전 요청
    await login(userPage, seed.userEmail, seed.userPassword)
    await userPage.goto('/credits')
    await expect(userPage.getByText('현재 잔액')).toBeVisible()
    const beforeBalance = await getBalanceFromCredits(userPage)

    await userPage.getByRole('button', { name: '충전 요청' }).first().click()
    await expect(userPage.getByText('충전 요청이 완료되었습니다')).toBeVisible()

    // 2) 관리자 로그인 후 승인
    await login(adminPage, seed.adminEmail, seed.adminPassword)
    await adminPage.goto('/admin/topups?status=requested')

    const userPrefix = seed.userId.slice(0, 8)
    const requestedRow = adminPage.getByRole('row', { name: new RegExp(userPrefix) })
    await expect(requestedRow.getByText(TOPUP_PACKAGE_ID)).toBeVisible()
    await requestedRow.getByRole('button', { name: '승인' }).click()
    await expect(adminPage.getByText(/충전 승인 완료|승인 완료/)).toBeVisible()

    await adminPage.goto('/admin/topups?status=approved')
    const approvedRow = adminPage.getByRole('row', { name: new RegExp(userPrefix) })
    await expect(approvedRow.getByText('승인됨')).toBeVisible()

    // 3) 유저 잔액 증가 확인
    await userPage.goto('/credits')
    await expect(userPage.getByText('현재 잔액')).toBeVisible()
    const afterBalance = await getBalanceFromCredits(userPage)

    expect(afterBalance).toBe(beforeBalance + TOPUP_AMOUNT)

    await userContext.close()
    await adminContext.close()
  })
})

async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', password)
  await page.getByRole('button', { name: '로그인' }).click()
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

async function getBalanceFromCredits(page: Page) {
  const card = page.getByText('현재 잔액').locator('..')
  const text = await card.locator('p').filter({ hasText: '크레딧' }).first().textContent()
  const value = Number((text || '').replace(/[^\d]/g, ''))
  return Number.isNaN(value) ? 0 : value
}
