/**
 * 온페이지 SEO 점검 결과 이메일 템플릿
 * 점검 결과 요약 + 백링크 서비스 CTA
 */

import * as React from 'react'

interface SeoReportEmailProps {
  customerEmail: string
  orderId: string
  siteUrl?: string
  keywords?: string
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.backlinkshop.co.kr'

export const SeoReportEmail: React.FC<SeoReportEmailProps> = ({
  customerEmail,
  orderId,
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
          background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
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
        .site-info {
          background: white;
          border: 1px solid #e5e7eb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .cta-section {
          background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin: 24px 0;
          text-align: center;
        }
        .cta-button {
          display: inline-block;
          background: #facc15;
          color: #1e3a5f;
          padding: 14px 36px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 16px;
          margin-top: 16px;
        }
        .cta-button-secondary {
          display: inline-block;
          background: white;
          color: #2563eb;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          margin: 8px;
        }
        .step-card {
          background: white;
          border-left: 4px solid #2563eb;
          padding: 16px;
          margin: 12px 0;
          border-radius: 4px;
        }
        .highlight-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 16px;
          margin: 20px 0;
          border-radius: 4px;
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
        <h1 style={{ margin: 0, fontSize: '26px' }}>
          &#128203; 온페이지 SEO 점검 결과가 준비되었습니다
        </h1>
      </div>

      <div className="content">
        <p style={{ fontSize: '16px', marginBottom: '10px' }}>
          안녕하세요, <strong>{customerEmail}</strong>님!
        </p>

        <p style={{ fontSize: '15px', color: '#374151' }}>
          요청하신 온페이지 SEO 점검이 완료되었습니다. 대시보드에서 상세 리포트를 다운로드하실 수
          있습니다.
        </p>

        {/* 사이트 정보 */}
        {siteUrl && (
          <div className="site-info">
            <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#111827' }}>
              점검 사이트 정보
            </p>
            <p style={{ margin: '4px 0', fontSize: '14px' }}>
              <strong>URL:</strong> {siteUrl}
            </p>
            {keywords && (
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                <strong>타겟 키워드:</strong> {keywords}
              </p>
            )}
          </div>
        )}

        {/* 리포트 다운로드 */}
        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <a
            href={`${APP_URL}/orders`}
            className="cta-button-secondary"
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '14px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            &#128196; 리포트 다운로드하기
          </a>
        </div>

        {/* 핵심 CTA: 다음 단계 안내 */}
        <div className="cta-section">
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>
            &#128640; SEO 점검 결과를 최대한 활용하세요
          </h2>
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', opacity: 0.9 }}>
            점검에서 발견된 문제를 해결하고, 고품질 백링크로
            <br />
            구글 상위노출을 실현하세요
          </p>
          <a
            href={`${APP_URL}/products/category/pbn`}
            className="cta-button"
            style={{
              display: 'inline-block',
              background: '#facc15',
              color: '#1e3a5f',
              padding: '14px 36px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            PBN 백링크로 순위 올리기
          </a>
        </div>

        {/* 추천 다음 단계 */}
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>
          &#128161; 추천 다음 단계
        </h3>

        <div className="step-card">
          <p style={{ margin: 0 }}>
            <strong>1단계: 경쟁사 도메인 분석 (무료)</strong>
          </p>
          <p style={{ margin: '4px 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
            경쟁사 대비 내 사이트의 DA, 백링크 수를 무료로 비교해보세요
          </p>
          <a
            href="https://domainchecker.co.kr"
            style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            무료 도메인 분석하기 &#8594;
          </a>
        </div>

        <div className="step-card">
          <p style={{ margin: 0 }}>
            <strong>2단계: PBN 백링크로 순위 상승</strong>
          </p>
          <p style={{ margin: '4px 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
            직접 구축한 고품질 PBN 네트워크로 2~4주 내 구글 순위 변화를 경험하세요
          </p>
          <a
            href={`${APP_URL}/products/category/pbn`}
            style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            PBN 백링크 상품 보기 &#8594;
          </a>
        </div>

        <div className="step-card">
          <p style={{ margin: 0 }}>
            <strong>3단계: 플랜 백링크로 자연스러운 프로필 구축</strong>
          </p>
          <p style={{ margin: '4px 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
            10가지 이상 백링크 유형을 조합하여 자연스러운 링크 프로필을 만들어보세요
          </p>
          <a
            href={`${APP_URL}/products/category/plan`}
            style={{ color: '#2563eb', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            플랜 백링크 상품 보기 &#8594;
          </a>
        </div>

        {/* 첫 충전 보너스 안내 */}
        <div className="highlight-box">
          <p style={{ margin: 0, fontWeight: 700 }}>&#127873; 첫 충전 100% 보너스 안내</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            아직 충전을 하지 않으셨다면, <strong>5만원만 충전해도 10만 크레딧</strong>을 받으실 수
            있습니다. 가입 보너스와 합치면 바로 PBN 백링크를 시작할 수 있어요!
          </p>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <a
              href={`${APP_URL}/credits`}
              style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: 'white',
                padding: '10px 24px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              크레딧 충전하기
            </a>
          </div>
        </div>

        {/* 상담 안내 */}
        <div
          style={{
            background: '#ede9fe',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>&#128172; SEO 전문가 상담이 필요하신가요?</strong>
            <br />
            점검 결과를 바탕으로 맞춤 전략을 제안해드립니다
          </p>
          <a
            href="https://t.me/goat82"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              color: '#7c3aed',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            텔레그램으로 상담하기 &#8594;
          </a>
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
