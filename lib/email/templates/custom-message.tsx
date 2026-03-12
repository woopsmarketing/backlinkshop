/**
 * 관리자 개별 메시지 이메일 템플릿
 */

import * as React from 'react'

interface CustomMessageEmailProps {
  customerEmail: string
  subject: string
  message: string
}

export const CustomMessageEmail: React.FC<CustomMessageEmailProps> = ({
  customerEmail,
  subject,
  message,
}) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          border-radius: 10px 10px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 40px 30px;
          border-radius: 0 0 10px 10px;
        }
        .message-box {
          background: white;
          padding: 30px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1 style={{ margin: 0, fontSize: '24px' }}>백링크샵</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>{subject}</p>
      </div>
      <div className="content">
        <p style={{ fontSize: '16px', marginTop: 0 }}>
          안녕하세요, <strong>{customerEmail}</strong> 고객님!
        </p>

        <div className="message-box">
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.9' }}>{message}</p>
        </div>

        <p style={{ fontSize: '14px', color: '#6b7280', margin: '25px 0 0 0' }}>
          문의사항이 있으시면 언제든지 연락주세요.
        </p>

        <div className="footer">
          <p style={{ margin: 0, fontWeight: '600' }}>백링크샵 팀 드림</p>
          <p style={{ margin: '10px 0 0 0' }}>
            <a href="https://backlinkshop.co.kr" style={{ color: '#667eea' }}>
              backlinkshop.co.kr
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
