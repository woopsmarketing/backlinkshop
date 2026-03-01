/**
 * 신규 주문 발생 시 관리자에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface OrderCreatedAdminEmailProps {
  customerEmail: string
  orderId: string
  productName: string
  quantity: number
  totalPrice: number
  note?: string
}

export const OrderCreatedAdminEmail: React.FC<OrderCreatedAdminEmailProps> = ({
  customerEmail,
  orderId,
  productName,
  quantity,
  totalPrice,
  note,
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
          background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
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
        .alert-box {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
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
          background: #ef4444;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 600;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1 style={{ margin: 0, fontSize: '28px' }}>🔔 신규 주문 알림</h1>
      </div>

      <div className="content">
        <div className="alert-box">
          <strong>⚠️ 새로운 주문이 접수되었습니다!</strong>
          <p style={{ margin: '10px 0 0 0' }}>즉시 확인하고 처리를 시작해주세요.</p>
        </div>

        <div className="order-info">
          <h2 style={{ marginTop: 0, fontSize: '18px', color: '#111827' }}>📦 주문 상세</h2>

          <div className="info-row">
            <span className="label">주문 번호</span>
            <span className="value" style={{ fontFamily: 'monospace' }}>
              {orderId}
            </span>
          </div>

          <div className="info-row">
            <span className="label">고객 이메일</span>
            <span className="value">{customerEmail}</span>
          </div>

          <div className="info-row">
            <span className="label">상품명</span>
            <span className="value">{productName}</span>
          </div>

          <div className="info-row">
            <span className="label">수량</span>
            <span className="value">{quantity}개</span>
          </div>

          <div className="info-row">
            <span className="label">결제 금액</span>
            <span className="value" style={{ fontWeight: 'bold', color: '#ef4444' }}>
              {totalPrice.toLocaleString()} 크레딧
            </span>
          </div>
        </div>

        {note && (
          <div className="note-box">
            <strong>📝 고객 요청사항</strong>
            <p style={{ margin: '10px 0 0 0', whiteSpace: 'pre-wrap' }}>{note}</p>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/orders`}
            className="button"
          >
            관리자 페이지에서 처리하기
          </a>
        </div>

        <div
          style={{ background: '#e0e7ff', padding: '15px', borderRadius: '6px', marginTop: '20px' }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>💡 처리 절차</strong>
            <br />
            1. 관리자 페이지에서 주문 상세 확인
            <br />
            2. &quot;처리중&quot; 상태로 변경 후 작업 시작
            <br />
            3. 작업 완료 후 보고서 업로드
            <br />
            4. &quot;완료&quot; 상태로 변경
          </p>
        </div>
      </div>
    </body>
  </html>
)
