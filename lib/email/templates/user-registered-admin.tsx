/**
 * 신규 회원가입 시 관리자에게 발송되는 이메일 템플릿
 */

import * as React from 'react'

interface UserRegisteredAdminEmailProps {
  userEmail: string
  userId: string
  registeredAt: string
}

export const UserRegisteredAdminEmail: React.FC<UserRegisteredAdminEmailProps> = ({
  userEmail,
  userId,
  registeredAt,
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
        .user-info {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #667eea;
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
        <h1 style={{ margin: 0, fontSize: '24px' }}>🎉 신규 회원 가입</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>백링크샵</p>
      </div>
      <div className="content">
        <p style={{ fontSize: '16px', marginTop: 0 }}>새로운 회원이 가입했습니다!</p>

        <div className="user-info">
          <div className="info-row">
            <span className="label">이메일</span>
            <span className="value">{userEmail}</span>
          </div>
          <div className="info-row">
            <span className="label">사용자 ID</span>
            <span className="value">{userId}</span>
          </div>
          <div className="info-row">
            <span className="label">가입 일시</span>
            <span className="value">{registeredAt}</span>
          </div>
        </div>

        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: 0 }}>
          💡 관리자 대시보드에서 회원 정보를 확인할 수 있습니다.
        </p>

        <div className="footer">
          <p style={{ margin: 0 }}>백링크샵 관리자 알림</p>
          <p style={{ margin: '5px 0 0 0' }}>
            <a href="https://backlinkshop.co.kr/admin/users" style={{ color: '#667eea' }}>
              회원 관리 바로가기
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
