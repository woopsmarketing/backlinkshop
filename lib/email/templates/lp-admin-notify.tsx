/**
 * LP 진단 신청 관리자 알림 이메일 템플릿
 */

import * as React from 'react'

interface LpAdminNotifyEmailProps {
  url: string
  keyword: string
  email: string
  ip: string
  timestamp: string
}

export const LpAdminNotifyEmail: React.FC<LpAdminNotifyEmailProps> = ({
  url,
  keyword,
  email,
  ip,
  timestamp,
}) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </head>
    <body>
      <div
        style={{
          background: 'linear-gradient(135deg, #ea580c, #dc2626)',
          color: 'white',
          padding: '20px 25px',
          borderRadius: '10px 10px 0 0',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '18px' }}>LP SEO 진단 신청</h2>
      </div>
      <div
        style={{
          background: '#f9fafb',
          padding: '25px',
          borderRadius: '0 0 10px 10px',
          border: '1px solid #e5e7eb',
          borderTop: 'none',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280', width: '80px' }}>URL</td>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>{url}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>키워드</td>
              <td style={{ padding: '8px 0', fontWeight: 600 }}>{keyword}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>이메일</td>
              <td style={{ padding: '8px 0' }}>{email}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>IP</td>
              <td style={{ padding: '8px 0', color: '#9ca3af', fontSize: '13px' }}>{ip}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: '#6b7280' }}>시간</td>
              <td style={{ padding: '8px 0', color: '#9ca3af', fontSize: '13px' }}>{timestamp}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>
)
