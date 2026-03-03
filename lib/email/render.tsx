/**
 * 이메일 템플릿 렌더링 유틸리티
 * Server Action에서 JSX를 사용하기 위한 래퍼 함수들
 */

import * as React from 'react'
import { OrderCreatedCustomerEmail } from './templates/order-created-customer'
import { OrderCreatedAdminEmail } from './templates/order-created-admin'
import { OrderStatusChangedEmail } from './templates/order-status-changed'
import { ReportUploadedEmail } from './templates/report-uploaded'
import { TopupApprovedEmail } from './templates/topup-approved'
import { UserRegisteredAdminEmail } from './templates/user-registered-admin'

/**
 * 주문 생성 - 고객 이메일 렌더링
 */
export function renderOrderCreatedCustomerEmail(props: {
  customerEmail: string
  orderId: string
  productName: string
  quantity: number
  totalPrice: number
  note?: string
  siteUrl?: string
  keywords?: string
  useSubKeywords?: boolean
  mainKeywordRatio?: number
  subKeywordRatio?: number
}) {
  return <OrderCreatedCustomerEmail {...props} />
}

/**
 * 주문 생성 - 관리자 이메일 렌더링
 */
export function renderOrderCreatedAdminEmail(props: {
  customerEmail: string
  orderId: string
  productName: string
  quantity: number
  totalPrice: number
  note?: string
  siteUrl?: string
  keywords?: string
  useSubKeywords?: boolean
  mainKeywordRatio?: number
  subKeywordRatio?: number
}) {
  return <OrderCreatedAdminEmail {...props} />
}

/**
 * 주문 상태 변경 이메일 렌더링
 */
export function renderOrderStatusChangedEmail(props: {
  customerEmail: string
  orderId: string
  productName: string
  oldStatus: string
  newStatus: string
}) {
  return <OrderStatusChangedEmail {...props} />
}

/**
 * 보고서 업로드 이메일 렌더링
 */
export function renderReportUploadedEmail(props: {
  customerEmail: string
  orderId: string
  productName: string
  reportFilename: string
}) {
  return <ReportUploadedEmail {...props} />
}

/**
 * 충전 승인 이메일 렌더링
 */
export function renderTopupApprovedEmail(props: {
  customerEmail: string
  amount: number
  newBalance: number
}) {
  return <TopupApprovedEmail {...props} />
}

/**
 * 신규 회원가입 - 관리자 알림 이메일 렌더링
 */
export function renderUserRegisteredAdminEmail(props: {
  userEmail: string
  userId: string
  registeredAt: string
}) {
  return <UserRegisteredAdminEmail {...props} />
}
