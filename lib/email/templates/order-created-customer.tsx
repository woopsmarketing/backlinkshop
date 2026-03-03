/**
 * 주문 생성 시 고객에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface OrderCreatedCustomerEmailProps {
  customerEmail: string
  orderId: string
  productName: string
  quantity: number
  totalPrice: number
  note?: string
  siteUrl?: string
  keywords?: string
}

export const OrderCreatedCustomerEmail: React.FC<OrderCreatedCustomerEmailProps> = ({
  customerEmail,
  orderId,
  productName,
  quantity,
  totalPrice,
  note,
  siteUrl,
  keywords,
}) => (
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .note-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .button {
          display: inline-block;
          background: #667eea;
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
        <h1 style={{ margin: 0, fontSize: '28px' }}>🎉 주문이 접수되었습니다</h1>
      </div>

      <div className="content">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          안녕하세요, <strong>{customerEmail}</strong>님!
        </p>
        <p>
          백링크샵에서 주문해주셔서 감사합니다.
          <br />
          주문이 정상적으로 접수되었으며, 곧 작업을 시작하겠습니다.
        </p>

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

          {!siteUrl && (
            <div className="info-row">
              <span className="label">수량</span>
              <span className="value">{quantity}개</span>
            </div>
          )}

          {siteUrl && (
            <div className="info-row">
              <span className="label">사이트 URL</span>
              <span className="value">{siteUrl}</span>
            </div>
          )}

          {keywords && (
            <div className="info-row">
              <span className="label">키워드</span>
              <span className="value">{keywords}</span>
            </div>
          )}

          <div className="info-row">
            <span className="label">결제 금액</span>
            <span className="value" style={{ fontWeight: 'bold', color: '#667eea' }}>
              {totalPrice.toLocaleString()} 크레딧
            </span>
          </div>
        </div>

        {note && (
          <div className="note-box">
            <strong>📝 요청사항</strong>
            <p style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap' }}>{note}</p>
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

        <div
          style={{ background: '#e0e7ff', padding: '15px', borderRadius: '6px', marginTop: '20px' }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>💡 다음 단계</strong>
            <br />
            1. 작업이 시작되면 상태가 &quot;처리중&quot;으로 변경됩니다
            <br />
            2. 작업 완료 시 보고서가 업로드되며 이메일로 알림을 받으실 수 있습니다
            <br />
            3. 주문 내역 페이지에서 진행 상황을 확인하실 수 있습니다
          </p>
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
