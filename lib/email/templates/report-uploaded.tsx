/**
 * 보고서 업로드 시 고객에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface ReportUploadedEmailProps {
  customerEmail: string
  orderId: string
  productName: string
  reportFilename: string
}

export const ReportUploadedEmail: React.FC<ReportUploadedEmailProps> = ({
  customerEmail,
  orderId,
  productName,
  reportFilename,
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
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
          background: #d1fae5;
          border-left: 4px solid #10b981;
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
        .button {
          display: inline-block;
          background: #10b981;
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
        <h1 style={{ margin: 0, fontSize: '28px' }}>📄 보고서가 업로드되었습니다</h1>
      </div>

      <div className="content">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          안녕하세요, <strong>{customerEmail}</strong>님!
        </p>

        <div className="highlight-box">
          <strong>✅ 작업이 완료되어 보고서가 업로드되었습니다!</strong>
          <p style={{ margin: '10px 0 0 0' }}>
            주문 내역 페이지에서 보고서를 다운로드하실 수 있습니다.
          </p>
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
            <span className="label">보고서 파일명</span>
            <span className="value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
              {reportFilename}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/orders`}
            className="button"
          >
            보고서 다운로드하기
          </a>
        </div>

        <div
          style={{ background: '#e0e7ff', padding: '15px', borderRadius: '6px', marginTop: '20px' }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>💡 보고서 확인 후</strong>
            <br />
            • 보고서 내용에 대해 궁금한 점이 있으시면 언제든 문의해주세요
            <br />
            • 추가 작업이 필요하신 경우 새로운 주문을 생성해주세요
            <br />• 서비스 이용 후기를 남겨주시면 큰 도움이 됩니다
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

export default ReportUploadedEmail
