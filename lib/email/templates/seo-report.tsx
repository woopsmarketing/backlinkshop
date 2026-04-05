/**
 * 온페이지 SEO 점검 결과 이메일 템플릿
 * 파싱 데이터 테이블 + AI 분석 결과 + CTA
 */

import * as React from 'react'
import type { ParsedSeo } from '@/lib/seo-analyzer'

interface SeoReportEmailProps {
  customerEmail: string
  orderId: string
  siteUrl?: string
  keywords?: string
  score?: number | null
  analysisHtml?: string
  parsedData?: ParsedSeo
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.backlinkshop.co.kr'

function scoreColor(s: number) {
  return s >= 80 ? '#16a34a' : s >= 60 ? '#ca8a04' : '#dc2626'
}
function scoreLabel(s: number) {
  return s >= 80 ? '양호' : s >= 60 ? '보통' : '개선 필요'
}
function pass(ok: boolean) {
  return ok ? '✓' : '✗'
}
function passStyle(ok: boolean): React.CSSProperties {
  return { color: ok ? '#16a34a' : '#dc2626', fontWeight: 600 }
}

function DataRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <tr>
      <td
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #f3f4f6',
          color: '#6b7280',
          fontSize: '13px',
          width: '40%',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #f3f4f6',
          fontSize: '13px',
          textAlign: 'right',
          ...(ok !== undefined ? passStyle(ok) : { color: '#111827' }),
        }}
      >
        {ok !== undefined && <span style={{ marginRight: '4px' }}>{pass(ok)}</span>}
        {value}
      </td>
    </tr>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '15px',
        fontWeight: 700,
        color: '#111827',
        margin: '24px 0 8px 0',
        padding: '8px 12px',
        background: '#f9fafb',
        borderRadius: '6px',
        borderLeft: '3px solid #2563eb',
      }}
    >
      {children}
    </h3>
  )
}

export const SeoReportEmail: React.FC<SeoReportEmailProps> = ({
  customerEmail,
  orderId,
  siteUrl,
  keywords,
  score,
  analysisHtml,
  parsedData: p,
}) => (
  <html>
    <head>
      <style>{`
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 24px; border-radius: 0 0 10px 10px; }
        .score-card { background: white; border-radius: 12px; padding: 24px; margin: 20px 0; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .analysis-box { background: white; border-radius: 8px; padding: 24px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.06); font-size: 14px; line-height: 1.8; }
        .analysis-box h2 { font-size: 17px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin-top: 20px; }
        .analysis-box h3 { font-size: 15px; color: #1e40af; margin-top: 16px; }
        .analysis-box strong { color: #111827; }
        .analysis-box code { background: #f3f4f6; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
        .analysis-box ul { padding-left: 18px; }
        .analysis-box li { margin-bottom: 6px; }
        .cta-section { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; padding: 28px; border-radius: 12px; margin: 24px 0; text-align: center; }
        .step-card { background: white; border-left: 4px solid #2563eb; padding: 14px; margin: 10px 0; border-radius: 4px; }
        .bonus-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; margin: 20px 0; border-radius: 4px; }
        .footer { text-align: center; color: #6b7280; font-size: 13px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1 style={{ margin: 0, fontSize: '24px' }}>온페이지 SEO 점검 결과</h1>
        <p style={{ margin: '6px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
          백링크샵 SEO 전문가가 분석을 완료했습니다
        </p>
      </div>

      <div className="content">
        <p style={{ fontSize: '15px', marginBottom: '8px' }}>
          안녕하세요, <strong>{customerEmail}</strong>님!
        </p>
        <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
          귀하의 주문을 잘 접수했으며, 귀하의 도메인인{' '}
          <strong>{siteUrl || '요청하신 사이트'}</strong>를 면밀하게 분석하였습니다.
        </p>
        <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
          아래는 사이트의 온페이지 SEO 상태를 47개 항목에 걸쳐 정밀 진단한 결과입니다.
          {keywords && (
            <>
              {' '}
              타겟 키워드 <strong>"{keywords}"</strong> 기준으로 분석했습니다.
            </>
          )}
        </p>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
          각 항목의 <span style={{ color: '#16a34a', fontWeight: 600 }}>&#10003;</span>는 양호,{' '}
          <span style={{ color: '#dc2626', fontWeight: 600 }}>&#10007;</span>는 개선이 필요한
          부분입니다. 리포트를 참고하여 내부 최적화를 진행하시면 구글 순위 상승에 큰 도움이 됩니다.
        </p>

        {/* SEO 점수 */}
        {score != null && (
          <div className="score-card">
            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>SEO 점수</p>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 800,
                lineHeight: 1,
                color: scoreColor(score),
                margin: '8px 0',
              }}
            >
              {score}
              <span style={{ fontSize: '20px' }}>점</span>
            </div>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: scoreColor(score) }}>
              {scoreLabel(score)}
            </p>
          </div>
        )}

        {/* ===== 파싱 데이터 테이블 ===== */}
        {p && (
          <>
            <SectionTitle>기본 정보</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow label="URL" value={p.url} />
                <DataRow label="상태 코드" value={String(p.statusCode)} ok={p.statusCode === 200} />
                <DataRow label="HTTPS" value={p.isHttps ? '적용됨' : '미적용'} ok={p.isHttps} />
                <DataRow label="로딩 시간" value={`${p.loadTimeMs}ms`} ok={p.loadTimeMs < 3000} />
                <DataRow label="HTML 크기" value={`${(p.htmlSize / 1024).toFixed(1)} KB`} />
                <DataRow label="단어 수" value={`${p.wordCount}개`} ok={p.wordCount >= 300} />
                <DataRow
                  label="텍스트/HTML 비율"
                  value={`${p.textToHtmlRatio}%`}
                  ok={p.textToHtmlRatio >= 10}
                />
                <DataRow
                  label="URL 깊이"
                  value={`${p.urlDepth}단계 (${p.urlLength}자)`}
                  ok={p.urlDepth <= 3}
                />
                {p.redirectCount > 0 && (
                  <DataRow
                    label="리다이렉트"
                    value={p.redirectIsWww ? '1회 (www 정규화 → 정상)' : `${p.redirectCount}회`}
                    ok={p.redirectIsWww}
                  />
                )}
              </tbody>
            </table>

            <SectionTitle>메타 태그</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow
                  label="Title"
                  value={
                    p.title
                      ? `${p.title.slice(0, 50)}${p.title.length > 50 ? '...' : ''} (${p.titleLength}자)`
                      : '없음'
                  }
                  ok={!!p.title && p.titleLength >= 15 && p.titleLength <= 60}
                />
                <DataRow
                  label="Description"
                  value={
                    p.metaDescription
                      ? `${p.metaDescription.slice(0, 50)}... (${p.metaDescriptionLength}자)`
                      : '없음'
                  }
                  ok={!!p.metaDescription && p.metaDescriptionLength >= 40}
                />
                <DataRow
                  label="Keywords"
                  value={p.metaKeywords ? `${p.metaKeywords.split(',').length}개` : '없음'}
                />
                <DataRow
                  label="Canonical"
                  value={p.canonical ? p.canonical.slice(0, 40) + '...' : '없음'}
                  ok={!!p.canonical}
                />
                <DataRow label="Robots" value={p.hasRobotsMeta || '없음'} />
                <DataRow label="Lang" value={p.lang || '없음'} ok={!!p.lang} />
              </tbody>
            </table>

            <SectionTitle>제목 구조</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow
                  label="H1"
                  value={
                    p.h1.length > 0
                      ? `${p.h1.length}개 — "${p.h1[0]?.slice(0, 40)}${(p.h1[0]?.length || 0) > 40 ? '...' : ''}"`
                      : '없음'
                  }
                  ok={p.h1.length === 1}
                />
                <DataRow label="H2" value={`${p.h2.length}개`} ok={p.h2.length > 0} />
                <DataRow label="H3" value={`${p.h3Count}개`} />
                {p.duplicateH1 && <DataRow label="중복 H1" value="감지됨" ok={false} />}
              </tbody>
            </table>

            <SectionTitle>이미지 &amp; 링크</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow label="이미지" value={`${p.imgTotal}개`} />
                <DataRow
                  label="Alt 미설정"
                  value={`${p.imgWithoutAlt}개`}
                  ok={p.imgWithoutAlt === 0}
                />
                <DataRow
                  label="내부 링크"
                  value={`${p.internalLinks}개`}
                  ok={p.internalLinks > 0}
                />
                <DataRow label="외부 링크" value={`${p.externalLinks}개`} />
                {p.nofollowLinks > 0 && (
                  <DataRow label="Nofollow 링크" value={`${p.nofollowLinks}개`} />
                )}
                {p.hasIframes > 0 && <DataRow label="iframe" value={`${p.hasIframes}개`} />}
              </tbody>
            </table>

            <SectionTitle>기술 SEO</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow
                  label="Viewport"
                  value={p.hasViewport ? '설정됨' : '미설정'}
                  ok={p.hasViewport}
                />
                <DataRow
                  label="Charset"
                  value={p.hasCharset ? '설정됨' : '미설정'}
                  ok={p.hasCharset}
                />
                <DataRow label="Favicon" value={p.hasFavicon ? '있음' : '없음'} ok={p.hasFavicon} />
                <DataRow
                  label="Gzip/Brotli"
                  value={p.hasGzip ? '적용됨' : '미적용'}
                  ok={p.hasGzip}
                />
                <DataRow label="HSTS" value={p.hasHsts ? '적용됨' : '미적용'} ok={p.hasHsts} />
                {p.hasCacheControl && (
                  <DataRow label="Cache-Control" value={p.hasCacheControl.slice(0, 50)} />
                )}
                <DataRow
                  label="인라인 CSS"
                  value={`${(p.inlineCssSize / 1024).toFixed(1)} KB`}
                  ok={p.inlineCssSize < 50000}
                />
                <DataRow
                  label="인라인 JS"
                  value={`${(p.inlineJsSize / 1024).toFixed(1)} KB`}
                  ok={p.inlineJsSize < 100000}
                />
                {p.hasDeprecatedTags.length > 0 && (
                  <DataRow
                    label="Deprecated 태그"
                    value={p.hasDeprecatedTags.join(', ')}
                    ok={false}
                  />
                )}
              </tbody>
            </table>

            <SectionTitle>소셜 &amp; 구조화 데이터</SectionTitle>
            <table className="data-table">
              <tbody>
                <DataRow
                  label="OG Tags"
                  value={`title=${pass(p.hasOgTitle)}, desc=${pass(p.hasOgDescription)}, img=${pass(p.hasOgImage)}`}
                  ok={p.hasOgTitle && p.hasOgDescription && p.hasOgImage}
                />
                {p.ogImageUrl && (
                  <DataRow label="OG Image" value={p.ogImageUrl.slice(0, 50) + '...'} />
                )}
                <DataRow
                  label="Twitter Card"
                  value={p.hasTwitterCard ? '있음' : '없음'}
                  ok={p.hasTwitterCard}
                />
                <DataRow
                  label="JSON-LD"
                  value={p.hasStructuredData ? p.structuredDataTypes.join(', ') : '없음'}
                  ok={p.hasStructuredData}
                />
                <DataRow label="Hreflang" value={p.hasHreflang ? '있음' : '없음'} />
              </tbody>
            </table>
          </>
        )}

        {/* ===== AI 분석 결과 ===== */}
        {analysisHtml && (
          <>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#111827',
                margin: '28px 0 12px 0',
              }}
            >
              AI SEO 분석
            </h2>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
              백링크샵 SEO 전문가가 분석한 진단 결과입니다.
            </p>
            <div className="analysis-box" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
          </>
        )}

        {/* ===== CTA ===== */}
        <div className="cta-section">
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>
            분석 결과를 바탕으로 순위를 올리세요
          </h2>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', opacity: 0.9 }}>
            내부 최적화 개선과 함께 고품질 백링크를 구축하면
            <br />
            2~4주 내 구글 순위 변화를 체험할 수 있습니다
          </p>
          <a
            href={`${APP_URL}/products/category/pbn`}
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

        <div className="step-card">
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>무료 도메인 분석</strong> — 경쟁사 대비 내 사이트의 DA, 백링크 수를 비교해보세요
          </p>
          <a
            href="https://domainchecker.co.kr"
            style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
          >
            무료 도메인 분석하기 &#8594;
          </a>
        </div>

        <div className="step-card">
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>플랜 백링크</strong> — 10가지 이상 백링크 유형을 조합하여 자연스러운 링크 프로필
            구축
          </p>
          <a
            href={`${APP_URL}/products/category/plan`}
            style={{ color: '#2563eb', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
          >
            플랜 백링크 상품 보기 &#8594;
          </a>
        </div>

        <div className="bonus-box">
          <p style={{ margin: 0, fontWeight: 700, fontSize: '14px' }}>첫 충전 100% 보너스</p>
          <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
            <strong>5만원만 충전해도 10만 크레딧</strong> 지급 (1회 한정). 가입 보너스와 합치면 바로
            PBN 백링크를 시작할 수 있어요.
          </p>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <a
              href={`${APP_URL}/credits`}
              style={{
                display: 'inline-block',
                background: '#f59e0b',
                color: 'white',
                padding: '8px 20px',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              크레딧 충전하기
            </a>
          </div>
        </div>

        <div
          style={{
            background: '#ede9fe',
            padding: '14px',
            borderRadius: '8px',
            marginTop: '16px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px' }}>
            <strong>SEO 전문가 상담이 필요하신가요?</strong>
            <br />
            점검 결과를 바탕으로 맞춤 전략을 제안해드립니다
          </p>
          <a
            href="https://t.me/goat82"
            style={{
              display: 'inline-block',
              marginTop: '6px',
              color: '#7c3aed',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            텔레그램으로 상담하기 &#8594;
          </a>
        </div>

        <div className="footer">
          <p>문의사항이 있으시면 언제든지 연락주세요.</p>
          <p style={{ margin: '4px 0' }}>
            백링크샵 | <a href="mailto:support@backlink-shop.com">support@backlink-shop.com</a>
          </p>
        </div>
      </div>
    </body>
  </html>
)
