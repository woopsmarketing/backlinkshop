/**
 * 온페이지 SEO 점검 결과 이메일 템플릿
 * 600px 폭, 모바일 친화적, 텔레그램 1:1 문의 CTA 집중
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

function scoreColor(s: number) {
  return s >= 80 ? '#16a34a' : s >= 60 ? '#ca8a04' : '#dc2626'
}
function scoreLabel(s: number) {
  return s >= 80 ? '양호' : s >= 60 ? '보통' : '개선 필요'
}
function pass(ok: boolean) {
  return ok ? '\u2713' : '\u2717'
}
function passStyle(ok: boolean): React.CSSProperties {
  return { color: ok ? '#16a34a' : '#dc2626', fontWeight: 600 }
}

function DataRow({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <tr>
      <td
        style={{
          padding: '7px 10px',
          borderBottom: '1px solid #f3f4f6',
          color: '#6b7280',
          fontSize: '12px',
          width: '38%',
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: '7px 10px',
          borderBottom: '1px solid #f3f4f6',
          fontSize: '12px',
          textAlign: 'right',
          ...(ok !== undefined ? passStyle(ok) : { color: '#111827' }),
        }}
      >
        {ok !== undefined && <span style={{ marginRight: '3px' }}>{pass(ok)}</span>}
        {value}
      </td>
    </tr>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#111827',
        margin: '20px 0 6px 0',
        padding: '6px 10px',
        background: '#f9fafb',
        borderRadius: '4px',
        borderLeft: '3px solid #2563eb',
      }}
    >
      {children}
    </h3>
  )
}

/* ─── 메인 테이블 래퍼 (600px 중앙 정렬) ─── */
function W({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: bg || 'transparent' }}>
      <tbody>
        <tr>
          <td align="center" style={{ padding: '0 16px' }}>
            <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: '560px' }}>
              <tbody>
                <tr>
                  <td>{children}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
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
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>{`
        body { margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #333; -webkit-text-size-adjust: 100%; }
        .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; }
        .analysis-box { background: white; border-radius: 6px; padding: 16px; margin: 16px 0; font-size: 13px; line-height: 1.8; }
        .analysis-box h2 { font-size: 15px; color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 4px; margin-top: 16px; }
        .analysis-box h3 { font-size: 14px; color: #1e40af; margin-top: 12px; }
        .analysis-box strong { color: #111827; }
        .analysis-box code { background: #f3f4f6; padding: 1px 4px; border-radius: 3px; font-size: 11px; }
        .analysis-box ul { padding-left: 16px; }
        .analysis-box li { margin-bottom: 4px; }
        @media only screen and (max-width: 620px) {
          .mobile-full { width: 100% !important; display: block !important; }
        }
      `}</style>
    </head>
    <body>
      {/* ===== 헤더 ===== */}
      <W bg="linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)">
        <div style={{ padding: '28px 0', textAlign: 'center', color: 'white' }}>
          <p
            style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              opacity: 0.8,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            백링크샵 SEO 리포트
          </p>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>온페이지 SEO 점검 결과</h1>
        </div>
      </W>

      {/* ===== 본문 ===== */}
      <W bg="#f3f4f6">
        <div style={{ padding: '24px 0' }}>
          {/* 인사말 */}
          <p style={{ fontSize: '14px', marginBottom: '6px' }}>
            안녕하세요, <strong>{customerEmail}</strong>님!
          </p>
          <p style={{ fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
            <strong>{siteUrl || '요청하신 사이트'}</strong>를 47개 항목에 걸쳐 정밀 진단했습니다.
            {keywords && (
              <>
                {' '}
                타겟 키워드 <strong>&ldquo;{keywords}&rdquo;</strong> 기준입니다.
              </>
            )}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '16px' }}>
            <span style={{ color: '#16a34a', fontWeight: 600 }}>&#10003;</span> 양호 &nbsp;
            <span style={{ color: '#dc2626', fontWeight: 600 }}>&#10007;</span> 개선 필요
          </p>

          {/* ===== SEO 점수 ===== */}
          {score != null && (
            <div
              style={{
                background: 'white',
                borderRadius: '10px',
                padding: '20px',
                margin: '0 0 16px 0',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>종합 SEO 점수</p>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  lineHeight: 1,
                  color: scoreColor(score),
                  margin: '6px 0',
                }}
              >
                {score}
                <span style={{ fontSize: '18px' }}>점</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: scoreColor(score) }}>
                {scoreLabel(score)}
              </p>
            </div>
          )}

          {/* ===== 메인 CTA: 텔레그램 1:1 문의 ===== */}
          <div
            style={{
              background: '#1e40af',
              borderRadius: '10px',
              padding: '20px',
              margin: '0 0 20px 0',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: 'white' }}>
              이 결과, 어떻게 활용해야 할지 궁금하신가요?
            </p>
            <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
              전문가가 보고서를 함께 분석하고 맞춤 전략을 무료로 안내해드립니다
            </p>
            <a
              href="https://t.me/goat82"
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#1e3a5f',
                padding: '12px 36px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              1:1 전문가 상담 (무료)
            </a>
          </div>

          {/* ===== 파싱 데이터 테이블 ===== */}
          {p && (
            <>
              <SectionTitle>기본 정보</SectionTitle>
              <table className="data-table">
                <tbody>
                  <DataRow label="URL" value={p.url} />
                  <DataRow
                    label="상태 코드"
                    value={String(p.statusCode)}
                    ok={p.statusCode === 200}
                  />
                  <DataRow label="HTTPS" value={p.isHttps ? '적용됨' : '미적용'} ok={p.isHttps} />
                  <DataRow label="로딩 시간" value={`${p.loadTimeMs}ms`} ok={p.loadTimeMs < 3000} />
                  <DataRow label="HTML 크기" value={`${(p.htmlSize / 1024).toFixed(1)} KB`} />
                  <DataRow label="단어 수" value={`${p.wordCount}개`} ok={p.wordCount >= 300} />
                  <DataRow
                    label="텍스트/HTML 비율"
                    value={`${p.textToHtmlRatio}%${p.textToHtmlRatio < 10 ? ' — SPA일 수 있음' : ''}`}
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
                      value={p.redirectIsWww ? '1회 (www 정규화)' : `${p.redirectCount}회`}
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
                        ? `${p.title.slice(0, 40)}${p.title.length > 40 ? '...' : ''} (${p.titleLength}자)`
                        : '없음'
                    }
                    ok={!!p.title && p.titleLength >= 15 && p.titleLength <= 60}
                  />
                  <DataRow
                    label="Description"
                    value={
                      p.metaDescription
                        ? `${p.metaDescription.slice(0, 40)}... (${p.metaDescriptionLength}자)`
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
                    value={p.canonical ? p.canonical.slice(0, 35) + '...' : '없음'}
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
                        ? `${p.h1.length}개 — "${p.h1[0]?.slice(0, 30)}${(p.h1[0]?.length || 0) > 30 ? '...' : ''}"`
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
                    <DataRow label="Nofollow" value={`${p.nofollowLinks}개`} />
                  )}
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
                  <DataRow
                    label="Favicon"
                    value={p.hasFavicon ? '있음' : '없음'}
                    ok={p.hasFavicon}
                  />
                  <DataRow
                    label="Gzip/Brotli"
                    value={p.hasGzip ? '적용됨' : '미적용'}
                    ok={p.hasGzip}
                  />
                  <DataRow label="HSTS" value={p.hasHsts ? '적용됨' : '미적용'} ok={p.hasHsts} />
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
                    <DataRow label="Deprecated" value={p.hasDeprecatedTags.join(', ')} ok={false} />
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
                </tbody>
              </table>
            </>
          )}

          {/* ===== AI 분석 결과 ===== */}
          {analysisHtml && (
            <>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '24px 0 8px 0',
                }}
              >
                SEO 전문가 진단 의견
              </h2>
              <div className="analysis-box" dangerouslySetInnerHTML={{ __html: analysisHtml }} />
            </>
          )}

          {/* ===== 하단 CTA: 텔레그램 집중 ===== */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              borderRadius: '10px',
              padding: '24px',
              margin: '20px 0',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: 'white' }}>
              보고서 결과가 궁금하시다면
            </p>
            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              전문가가 직접 분석 결과를 설명하고, 내 사이트에 맞는 최적의 전략을 제안해드립니다
            </p>
            <a
              href="https://t.me/goat82"
              style={{
                display: 'inline-block',
                background: '#facc15',
                color: '#1e3a5f',
                padding: '12px 40px',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              1:1 무료 상담받기
            </a>
          </div>

          {/* ===== 보조 서비스 링크 ===== */}
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#6b7280' }}>무료 SEO 도구</p>
            <a
              href="https://seoworld.co.kr"
              style={{
                color: '#2563eb',
                fontSize: '12px',
                textDecoration: 'none',
                marginRight: '16px',
              }}
            >
              SEO 분석 도구 &rarr;
            </a>
            <a
              href="https://domainchecker.co.kr"
              style={{ color: '#2563eb', fontSize: '12px', textDecoration: 'none' }}
            >
              도메인 분석 &rarr;
            </a>
          </div>

          {/* ===== 푸터 ===== */}
          <div
            style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '11px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <p style={{ margin: '0 0 4px 0' }}>백링크샵 | backlinkshop.co.kr</p>
            <p style={{ margin: 0 }}>문의: support@backlink-shop.com</p>
          </div>
        </div>
      </W>
    </body>
  </html>
)
