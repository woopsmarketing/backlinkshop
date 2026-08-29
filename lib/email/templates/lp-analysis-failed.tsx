/**
 * LP SEO 분석 실패 안내 이메일 템플릿
 */

import * as React from 'react'

interface LpAnalysisFailedEmailProps {
  email: string
  url: string
  keyword: string
}

export const LpAnalysisFailedEmail: React.FC<LpAnalysisFailedEmailProps> = ({
  email,
  url,
  keyword,
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
      `}</style>
    </head>
    <body>
      <div
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px 10px 0 0',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '22px' }}>SEO 진단을 완료할 수 없었습니다</h1>
      </div>
      <div
        style={{
          background: '#f9fafb',
          padding: '30px',
          borderRadius: '0 0 10px 10px',
        }}
      >
        <p style={{ fontSize: '15px', marginTop: 0 }}>안녕하세요, 백링크샵입니다.</p>

        <p style={{ fontSize: '15px' }}>
          요청하신 SEO 진단을 처리하는 과정에서 사이트에 접근할 수 없었습니다.
        </p>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            border: '1px solid #e5e7eb',
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>요청 정보</p>
          <p style={{ margin: '0 0 4px 0', fontSize: '15px' }}>
            <strong>URL:</strong> {url}
          </p>
          <p style={{ margin: 0, fontSize: '15px' }}>
            <strong>키워드:</strong> {keyword}
          </p>
        </div>

        <div
          style={{
            background: '#fef3c7',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px 0',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e', lineHeight: '1.7' }}>
            <strong>가능한 원인:</strong>
            <br />
            - URL이 정확하지 않을 수 있습니다 (오타 확인)
            <br />
            - 해당 사이트의 보안 설정으로 접근이 차단되었을 수 있습니다
            <br />- 사이트가 일시적으로 다운되어 있을 수 있습니다
          </p>
        </div>

        <p style={{ fontSize: '15px' }}>URL을 확인하신 후 다시 시도해주세요.</p>

        <div style={{ textAlign: 'center', margin: '25px 0' }}>
          <a
            href="https://backlinkshop.co.kr/lp/seo"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #ea580c, #dc2626)',
              color: 'white',
              padding: '14px 30px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '15px',
            }}
          >
            다시 진단 신청하기
          </a>
        </div>

        <div
          style={{
            textAlign: 'center',
            margin: '20px 0',
            padding: '15px',
            background: '#ecfdf5',
            borderRadius: '8px',
          }}
        >
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#059669' }}>
            직접 해결이 어려우시다면
          </p>
          <a
            href="https://oopsad.com/tg"
            rel="nofollow noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#0088cc',
              color: 'white',
              padding: '10px 25px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
            }}
          >
            1:1 전문가 상담 (무료)
          </a>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb',
            color: '#6b7280',
            fontSize: '13px',
          }}
        >
          <p style={{ margin: 0 }}>백링크샵 드림</p>
          <p style={{ margin: '5px 0 0 0' }}>
            <a href="https://backlinkshop.co.kr" style={{ color: '#ea580c' }}>
              backlinkshop.co.kr
            </a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
