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
        <h1 style={{ margin: 0, fontSize: '28px' }}>🎉 백링크샵 정식 오픈!</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9, fontSize: '16px' }}>
          국내 최고 품질의 SEO 백링크 서비스
        </p>
      </div>
      <div className="content">
        <p style={{ fontSize: '16px', marginTop: 0 }}>
          안녕하세요, <strong>{customerEmail}</strong> 고객님!
        </p>

        <div className="message-box">
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '25px',
              borderRadius: '8px',
              marginBottom: '25px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '600', lineHeight: '1.6' }}>
              여기저기서 SEO 작업을 맡겨도 효과가 나오지 않으셨죠?
              <br />
              순위가 오히려 뒤로 밀려나고 다시 복구가 되지 않았나요?
            </p>
          </div>

          <h2
            style={{
              marginTop: 0,
              color: '#667eea',
              fontSize: '22px',
              textAlign: 'center',
            }}
          >
            기다리고 기다리시던 국내 최고 서비스 품질의
            <br />
            <span style={{ color: '#764ba2' }}>SEO 작업을 업데이트 하였습니다! 🚀</span>
          </h2>

          <div
            style={{
              background: '#ecfdf5',
              padding: '20px',
              borderRadius: '8px',
              margin: '20px 0',
              borderLeft: '4px solid #10b981',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#059669' }}>
              저희 백링크샵이 이제 정식적으로 오픈하였습니다! 🎊
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '15px', color: '#047857' }}>
              기다려주셔서 진심으로 감사드립니다.
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '2px solid #e5e7eb', margin: '30px 0' }} />

          <h3 style={{ color: '#667eea', fontSize: '18px' }}>
            📝 이전 주문하신 고객님께 안내 드립니다
          </h3>

          <div className="highlight">
            <p style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.7' }}>
              이전에 저희 백링크샵에서 <strong>무료 크레딧을 이용하여 구매하신 상품</strong>에 대한
              정확한 양식을 받고자 이메일 드립니다.
            </p>
            <p style={{ margin: '0 0 15px 0', fontSize: '15px', lineHeight: '1.7' }}>
              정식 오픈 전에는 <strong>수량과 요청사항란만 있어서</strong> 고객님의 주문을 제대로
              처리할 수가 없었습니다. 불편을 드려 정말 죄송합니다. 🙏
            </p>
            <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.7', color: '#dc2626' }}>
              백링크 작업에서 <strong>필수인 사이트 주소와 키워드</strong>를 제공해주시면 즉시
              작업을 진행해드리겠습니다!
            </p>
          </div>

          <div
            style={{
              background: 'white',
              border: '2px solid #667eea',
              padding: '25px',
              borderRadius: '8px',
              margin: '25px 0',
            }}
          >
            <h4 style={{ marginTop: 0, color: '#667eea', fontSize: '17px' }}>✅ 필수 제출 정보</h4>
            <ul style={{ margin: '15px 0', paddingLeft: '25px' }}>
              <li style={{ marginBottom: '12px', fontSize: '15px' }}>
                <strong style={{ color: '#667eea' }}>사이트 주소</strong>
                <br />
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  백링크를 적용할 웹사이트 URL (예: https://example.com)
                </span>
              </li>
              <li style={{ marginBottom: '12px', fontSize: '15px' }}>
                <strong style={{ color: '#667eea' }}>키워드</strong>
                <br />
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  원하시는 키워드 (예: SEO 최적화, 백링크 구매 등)
                </span>
              </li>
            </ul>
            <p
              style={{
                margin: '15px 0 0 0',
                padding: '15px',
                background: '#f0fdf4',
                borderRadius: '6px',
                fontSize: '15px',
                color: '#059669',
                fontWeight: '600',
              }}
            >
              ✨ 키워드는 무제한! 원하시는 만큼 설정 가능합니다!
            </p>
          </div>

          <div style={{ textAlign: 'center', margin: '35px 0' }}>
            <a
              href="https://oopsad.com/tg"
              rel="nofollow noopener noreferrer"
              className="cta-button"
              style={{
                display: 'inline-block',
                background: '#0088cc',
                color: 'white',
                padding: '18px 40px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '17px',
                boxShadow: '0 4px 12px rgba(0, 136, 204, 0.3)',
              }}
            >
              💬 24시간 실시간 텔레그램 문의
            </a>
            <p style={{ margin: '15px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
              텔레그램으로 사이트 주소와 키워드를 보내주세요!
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              margin: '20px 0',
            }}
          >
            <a
              href="https://backlinkshop.co.kr/orders"
              style={{
                display: 'inline-block',
                background: '#667eea',
                color: 'white',
                padding: '12px 25px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              📋 주문내역 바로가기
            </a>
            <a
              href="https://backlinkshop.co.kr"
              style={{
                display: 'inline-block',
                background: '#764ba2',
                color: 'white',
                padding: '12px 25px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              🏠 백링크샵 바로가기
            </a>
          </div>

          <p
            style={{
              fontSize: '14px',
              color: '#6b7280',
              textAlign: 'center',
              margin: '25px 0 0 0',
            }}
          >
            💡 텔레그램 또는 이메일 답장으로 정보를 보내주시면
            <br />
            빠르게 백링크 작업을 시작해드리겠습니다!
          </p>
        </div>

        <div
          style={{
            background: '#fef3c7',
            padding: '20px',
            borderRadius: '8px',
            margin: '25px 0',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <p style={{ margin: 0, fontSize: '15px', color: '#92400e', lineHeight: '1.7' }}>
            <strong>🙏 다시 한번 사과의 말씀을 드립니다</strong>
            <br />
            정식 오픈 전에는 수량과 요청사항란만 있어서 고객님의 주문을 제대로 처리할 수가
            없었습니다. 불편을 드려 정말 죄송합니다.
            <br />
            <br />
            저희 백링크샵에 관심을 가져주시고 기다려주셔서 진심으로 감사드립니다. ❤️
          </p>
        </div>

        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: 0, textAlign: 'center' }}>
          궁금하신 사항이 있으시면 언제든지 텔레그램으로 문의해주세요!
          <br />
          24시간 실시간으로 답변드리겠습니다.
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
