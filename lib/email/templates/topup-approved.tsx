/**
 * 크레딧 충전 승인 시 고객에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface TopupApprovedEmailProps {
  customerEmail: string
  amount: number
  newBalance: number
}

export const TopupApprovedEmail: React.FC<TopupApprovedEmailProps> = ({
  customerEmail,
  amount,
  newBalance,
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
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
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
        .highlight-box {
          background: #ede9fe;
          border-left: 4px solid #8b5cf6;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .balance-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-align: center;
        }
        .amount {
          font-size: 36px;
          font-weight: bold;
          color: #8b5cf6;
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: #8b5cf6;
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
        <h1 style={{ margin: 0, fontSize: '28px' }}>💰 크레딧 충전이 완료되었습니다</h1>
      </div>

      <div className="content">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          안녕하세요, <strong>{customerEmail}</strong>님!
        </p>

        <div className="highlight-box">
          <strong>✅ 크레딧 충전이 승인되었습니다!</strong>
          <p style={{ margin: '10px 0 0 0' }}>
            이제 충전된 크레딧으로 다양한 서비스를 이용하실 수 있습니다.
          </p>
        </div>

        <div className="balance-card">
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>충전 금액</p>
          <div className="amount">+{amount.toLocaleString()} 크레딧</div>

          <div style={{ borderTop: '1px solid #e5e7eb', margin: '20px 0', paddingTop: '20px' }}>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>현재 잔액</p>
            <div
              style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '5px' }}
            >
              {newBalance.toLocaleString()} 크레딧
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`}
            className="button"
          >
            대시보드로 이동
          </a>
        </div>

        <div
          style={{ background: '#e0e7ff', padding: '15px', borderRadius: '6px', marginTop: '20px' }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>💡 다음 단계</strong>
            <br />
            • 상품 페이지에서 원하는 서비스를 선택하세요
            <br />
            • 주문 시 크레딧이 자동으로 차감됩니다
            <br />• 크레딧 내역은 대시보드에서 확인하실 수 있습니다
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

export default TopupApprovedEmail
