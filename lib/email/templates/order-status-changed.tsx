/**
 * 주문 상태 변경 시 고객에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface OrderStatusChangedEmailProps {
  customerEmail: string
  orderId: string
  productName: string
  oldStatus: string
  newStatus: string
}

const statusLabels: Record<string, string> = {
  pending: '대기중',
  processing: '처리중',
  completed: '완료',
  failed: '실패',
}

const statusEmojis: Record<string, string> = {
  pending: '⏳',
  processing: '🔄',
  completed: '✅',
  failed: '❌',
}

const statusColors: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  completed: '#10b981',
  failed: '#ef4444',
}

export const OrderStatusChangedEmail: React.FC<OrderStatusChangedEmailProps> = ({
  customerEmail,
  orderId,
  productName,
  oldStatus,
  newStatus,
}) => {
  const statusColor = statusColors[newStatus] || '#6b7280'
  const statusEmoji = statusEmojis[newStatus] || '📦'
  const statusLabel = statusLabels[newStatus] || newStatus

  return (
    <html>
      <head>
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: ${statusColor};
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .status-badge {
            display: inline-block;
            background: ${statusColor};
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 18px;
            margin: 20px 0;
          }
          .order-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
          }
          .value {
            color: #111827;
          }
          .button {
            display: inline-block;
            background: ${statusColor};
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
          }
          .footer {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1 style={{ margin: 0, fontSize: '28px' }}>{statusEmoji} 주문 상태가 변경되었습니다</h1>
        </div>

        <div className="content">
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            안녕하세요, <strong>{customerEmail}</strong>님!
          </p>

          <div style={{ textAlign: 'center' }}>
            <p>주문 상태가 다음과 같이 변경되었습니다:</p>
            <div className="status-badge">
              {statusEmoji} {statusLabel}
            </div>
          </div>

          <div className="order-info">
            <h2 style={{ marginTop: 0, fontSize: '18px', color: '#111827' }}>📦 주문 정보</h2>

            <div className="info-row">
              <span className="label">주문 번호</span>
              <span className="value">{orderId.slice(0, 8)}...</span>
            </div>

            <div className="info-row">
              <span className="label">상품명</span>
              <span className="value">{productName}</span>
            </div>

            <div className="info-row">
              <span className="label">현재 상태</span>
              <span className="value" style={{ fontWeight: 'bold', color: statusColor }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {newStatus === 'processing' && (
            <div
              style={{
                background: '#dbeafe',
                padding: '15px',
                borderRadius: '6px',
                marginTop: '20px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>🔄 작업이 시작되었습니다</strong>
                <br />
                작업이 완료되면 보고서가 업로드되며 다시 알림을 보내드립니다.
              </p>
            </div>
          )}

          {newStatus === 'completed' && (
            <div
              style={{
                background: '#d1fae5',
                padding: '15px',
                borderRadius: '6px',
                marginTop: '20px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>✅ 작업이 완료되었습니다</strong>
                <br />
                주문 내역 페이지에서 보고서를 다운로드하실 수 있습니다.
              </p>
            </div>
          )}

          {newStatus === 'failed' && (
            <div
              style={{
                background: '#fee2e2',
                padding: '15px',
                borderRadius: '6px',
                marginTop: '20px',
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>
                <strong>❌ 작업 처리 중 문제가 발생했습니다</strong>
                <br />
                고객센터로 문의해주시면 빠르게 도와드리겠습니다.
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <a
              href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders`}
              className="button"
            >
              주문 내역 확인하기
            </a>
          </div>

          <div className="footer">
            <p>문의사항이 있으시면 언제든지 연락주세요.</p>
            <p style={{ margin: '5px 0' }}>
              백링크샵 | <a href="mailto:support@backlink-shop.com">support@backlink-shop.com</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
