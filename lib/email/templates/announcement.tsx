/**
 * 공지사항 이메일 템플릿
 */

import * as React from 'react'

interface AnnouncementEmailProps {
  customerEmail: string
}

export const AnnouncementEmail: React.FC<AnnouncementEmailProps> = ({ customerEmail }) => (
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
        }
        .highlight {
          background: #fef3c7;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f59e0b;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 15px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin: 10px 0;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1 style={{ margin: 0, fontSize: '28px' }}>📢 중요 공지사항</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>백링크샵</p>
      </div>
      <div className="content">
        <p style={{ fontSize: '16px', marginTop: 0 }}>
          안녕하세요, <strong>{customerEmail}</strong> 고객님!
        </p>

        <div className="message-box">
          <h2 style={{ marginTop: 0, color: '#667eea' }}>
            회원가입과 주문을 주셔서 감사드립니다 🙏
          </h2>

          <p>저희 백링크샵을 이용해주셔서 진심으로 감사드립니다.</p>

          <div className="highlight">
            <h3 style={{ marginTop: 0, color: '#f59e0b' }}>⚠️ 중요 안내</h3>
            <p>
              현재 저희 사이트는 <strong>MVP(Minimum Viable Product) 단계</strong>로 테스트 중에
              있습니다.
            </p>
            <p>
              일부 주문 양식이 제대로 제출되지 않은 경우가 있어, 백링크 작업을 위한{' '}
              <strong>추가 정보가 필요</strong>합니다.
            </p>
          </div>

          <h3 style={{ color: '#667eea' }}>📝 백링크 주문하신 고객님께</h3>
          <p>백링크 작업을 진행하기 위해 다음 정보를 회신해주시면 감사하겠습니다:</p>
          <ul>
            <li>
              <strong>사이트 주소</strong> (백링크를 적용할 웹사이트 URL)
            </li>
            <li>
              <strong>키워드</strong> (원하시는 키워드, 무제한 설정 가능)
            </li>
          </ul>

          <p style={{ color: '#059669', fontWeight: '600' }}>
            ✨ 키워드는 무제한으로 원하시는 만큼 설정 가능합니다!
          </p>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <a
              href="mailto:vnfm0580@gmail.com?subject=[백링크샵] 사이트 주소 및 키워드 제출&body=주문 ID:%0D%0A사이트 주소:%0D%0A키워드:%0D%0A"
              className="cta-button"
              style={{
                background: '#667eea',
                color: 'white',
                padding: '15px 30px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              📧 이메일로 정보 보내기
            </a>
          </div>

          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            💡 이메일 회신 시 주문 ID와 함께 사이트 주소 및 키워드를 보내주시면 빠르게
            처리해드리겠습니다.
          </p>
        </div>

        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 0 }}>
          불편을 드려 죄송하며, 더 나은 서비스로 보답하겠습니다.
          <br />
          문의사항이 있으시면 언제든지 연락 주세요!
        </p>

        <div className="footer">
          <p style={{ margin: 0, fontWeight: '600' }}>백링크샵 팀 드림</p>
          <p style={{ margin: '10px 0 0 0' }}>
            <a href="https://backlinkshop.co.kr" style={{ color: '#667eea' }}>
              backlinkshop.co.kr
            </a>
            {' | '}
            <a href="mailto:vnfm0580@gmail.com" style={{ color: '#667eea' }}>
              vnfm0580@gmail.com
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
