// v1.0 - Playwright 설정 추가 (2026-02-05)
/**
 * Playwright 테스트 설정
 * .env.local 환경변수를 로드하여 baseURL 구성
 */

import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60 * 1000,
  expect: { timeout: 10 * 1000 },
  use: {
    baseURL,
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  reporter: [['list']],
})

