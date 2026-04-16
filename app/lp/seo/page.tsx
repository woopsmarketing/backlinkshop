// v2.0 - Google Ads 전용 LP (풍부한 콘텐츠 + 정책 친화적) (2026-04-07)
import type { Metadata } from 'next'
import { LPHeroForm } from './LPHeroForm'
import { LPHeroCopy } from './LPHeroCopy'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: '무료 SEO 진단 | 백링크샵 - 구글 상위노출 전문',
  description:
    '구글 검색 순위가 낮은 진짜 이유, 10분 안에 무료로 확인하세요. 가입만 하면 20만원 상당의 정밀 분석 리포트를 이메일로 보내드립니다.',
  robots: { index: false, follow: false },
}

export default function LPSeoPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── SECTION 1: Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        {/* 배경 블롭 */}
        <div
          className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          aria-hidden="true"
        />
        <div
          className="absolute top-40 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          aria-hidden="true"
        />

        <div className="relative max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
          {/* 텍스트 */}
          <LPHeroCopy />

          {/* 폼 */}
          <div className="mt-10">
            <LPHeroForm />
          </div>

          {/* 리포트 미리보기 */}
          <div className="mt-8 max-w-lg mx-auto bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5">
            <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">
              진단 보고서 미리보기
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">종합 SEO 점수</span>
                <span className="text-sm font-bold text-cyan-400">72 / 100</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
                  style={{ width: '72%' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-gray-400">메타태그</span>
                  <span className="text-yellow-400 font-semibold">주의</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-gray-400">페이지 속도</span>
                  <span className="text-red-400 font-semibold">개선 필요</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-gray-400">모바일 최적화</span>
                  <span className="text-green-400 font-semibold">양호</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-gray-400">콘텐츠 품질</span>
                  <span className="text-yellow-400 font-semibold">주의</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center pt-1">
                * 실제 보고서에는 50개 이상 항목이 포함됩니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: 핵심 성과 지표 ── */}
      <section className="py-4 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 text-center">
            {[
              { num: '50+', label: '진단 항목', sub: '정밀 분석' },
              { num: '10분', label: '평균 소요 시간', sub: '이메일 발송' },
              { num: '20만', label: '무료 크레딧', sub: '가입 즉시 지급' },
              { num: '0원', label: '카드 등록', sub: '결제 정보 불필요' },
            ].map(item => (
              <div key={item.label}>
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{item.num}</p>
                <p className="text-sm text-gray-300 font-semibold mt-1">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: 문제 인식 (손실 회피) ── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2">왜 SEO 진단이 필요한가요?</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              검색 2페이지 이후 사이트는
              <br />
              <span className="text-red-500">사실상 존재하지 않습니다</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              구글 검색 사용자의 91.5%는 1페이지에서 클릭을 완료합니다. 당신의 사이트가 2페이지
              이하라면, 매일 잠재 고객을 경쟁사에게 빼앗기고 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 items-center">
            {/* 왼쪽: 시각적 비교 */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">1페이지 (1~10위)</span>
                  <span className="text-blue-600 font-bold text-lg">91.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-5 rounded-full flex items-center justify-end pr-3"
                    style={{ width: '91.5%' }}
                  >
                    <span className="text-xs text-white font-semibold">클릭의 대부분</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">2페이지 (11~20위)</span>
                  <span className="text-orange-500 font-bold text-lg">4.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div className="bg-orange-400 h-5 rounded-full" style={{ width: '4.8%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">3페이지 이후</span>
                  <span className="text-red-500 font-bold text-lg">0.63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-5">
                  <div className="bg-red-400 h-5 rounded-full" style={{ width: '2%' }} />
                </div>
              </div>
            </div>

            {/* 오른쪽: 임팩트 카드 */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">매출 기회 손실</p>
                    <p className="text-sm text-gray-500 mt-1">
                      2페이지 사이트는 1페이지 대비 클릭률이{' '}
                      <strong className="text-red-500">95% 낮습니다</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">시간이 지날수록 불리</p>
                    <p className="text-sm text-gray-500 mt-1">
                      경쟁사가 SEO를 강화할수록{' '}
                      <strong className="text-orange-500">격차는 매일 벌어집니다</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">해결의 첫 걸음</p>
                    <p className="text-sm text-gray-500 mt-1">
                      정확한 진단 없이는 어디를 고쳐야 하는지{' '}
                      <strong className="text-blue-500">알 수 없습니다</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: 진단 포함 항목 (가치 제시) ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2">진단 항목</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              50개 이상 항목을 정밀 분석합니다
            </h2>
            <p className="text-gray-500">
              외부 SEO 에이전시에 의뢰하면 30~50만원 수준의 진단을,
              <br className="hidden sm:block" />
              지금 <strong className="text-gray-900">무료</strong>로 받아보세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: '🔍',
                title: '도메인 권위도 분석',
                desc: 'DA/DR 점수, 도메인 나이, 신뢰도를 종합 평가합니다',
              },
              {
                icon: '📊',
                title: '구글 인덱싱 현황',
                desc: '구글에 몇 페이지가 등록되어 있는지, 누락된 페이지가 있는지 확인합니다',
              },
              {
                icon: '🏷️',
                title: '메타태그 & 헤딩 검증',
                desc: 'Title, Description, H1~H6 구조가 SEO에 맞게 설정되었는지 점검합니다',
              },
              {
                icon: '⚡',
                title: '페이지 속도 측정',
                desc: 'Core Web Vitals (LCP, FID, CLS) 기준으로 로딩 성능을 측정합니다',
              },
              {
                icon: '📱',
                title: '모바일 최적화 확인',
                desc: '모바일 반응형, 터치 요소 간격, 뷰포트 설정을 검사합니다',
              },
              {
                icon: '🔗',
                title: '내부 링크 구조 분석',
                desc: '사이트 내부 링크가 효율적으로 연결되어 있는지 분석합니다',
              },
              {
                icon: '📝',
                title: '콘텐츠 품질 평가',
                desc: '키워드 밀도, 콘텐츠 길이, 가독성을 기준으로 평가합니다',
              },
              {
                icon: '🛡️',
                title: '기술적 SEO 이슈',
                desc: 'robots.txt, sitemap, canonical, SSL 등 기술적 요소를 전수 검사합니다',
              },
              {
                icon: '📈',
                title: '종합 점수 & 개선안',
                desc: '0~100점 종합 점수와 우선순위별 구체적 개선 방향을 제시합니다',
              },
            ].map(item => (
              <div
                key={item.title}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <span className="text-2xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 가격 비교 + CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 sm:p-10 text-center text-white">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div>
                <p className="text-sm text-blue-200">일반 SEO 진단 비용</p>
                <p className="text-2xl font-bold line-through text-blue-200">30~50만원</p>
              </div>
              <div className="text-3xl">→</div>
              <div>
                <p className="text-sm text-cyan-200">백링크샵 회원</p>
                <p className="text-3xl font-extrabold">무료</p>
              </div>
            </div>
            <a
              href="/login?from=lp"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 shadow-2xl transition-all"
            >
              무료 SEO 진단 받기
            </a>
            <p className="text-blue-200 text-sm mt-3">카드 등록 없이, 가입만 하면 즉시 시작</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: 프로세스 (간단함 강조) ── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2">진행 과정</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">3단계면 충분합니다</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: '무료 가입',
                desc: '이메일만 입력하면 10초 만에 가입 완료. 20만 크레딧이 즉시 지급됩니다.',
                time: '10초',
              },
              {
                step: '02',
                title: 'SEO 진단 신청',
                desc: '사이트 URL과 핵심 키워드 1개만 입력하세요. AI가 실시간으로 사이트를 분석합니다.',
                time: '30초',
              },
              {
                step: '03',
                title: '보고서 수신',
                desc: '10~20분 내 이메일로 상세 보고서가 발송됩니다. 점수, 문제점, 개선안이 모두 포함됩니다.',
                time: '10~20분',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl font-extrabold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.desc}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                  소요 시간: {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: 사회적 증거 (성공 사례) ── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2">실제 성과</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              진단 후 실행까지, 실제 고객 결과
            </h2>
            <p className="text-gray-500">
              무료 진단으로 문제를 파악하고, 전문가 솔루션으로 해결한 사례입니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {[
              {
                type: '쇼핑몰',
                before: '340',
                after: '4,200',
                period: '4주',
                growth: '+1,135%',
                keyword: '인테리어 소품',
              },
              {
                type: 'SaaS 서비스',
                before: '1,200',
                after: '8,500',
                period: '6주',
                growth: '+608%',
                keyword: '프로젝트 관리',
              },
              {
                type: '로컬 비즈니스',
                before: '80',
                after: '1,450',
                period: '3주',
                growth: '+1,713%',
                keyword: '강남 피부과',
              },
            ].map(item => (
              <div
                key={item.type}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold mb-4">
                  {item.type}
                </span>
                <p className="text-xs text-gray-400 mb-1">키워드: {item.keyword}</p>
                <div className="flex items-end gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Before</p>
                    <p className="text-xl font-bold text-gray-300">{item.before}</p>
                  </div>
                  <span className="text-gray-300 text-lg pb-1">→</span>
                  <div>
                    <p className="text-xs text-gray-400">After ({item.period})</p>
                    <p className="text-xl font-bold text-blue-600">{item.after}</p>
                  </div>
                </div>
                <div className="px-3 py-2 bg-green-50 rounded-lg text-center">
                  <span className="text-green-600 font-bold text-lg">{item.growth}</span>
                  <span className="text-green-600 text-sm ml-1">월 방문자 증가</span>
                </div>
              </div>
            ))}
          </div>

          {/* 고객 한마디 */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  &ldquo;무료 진단 보고서를 받아보고, 우리 사이트에 이렇게 많은 기술적 문제가
                  있었는지 처음 알았습니다. 메타태그 하나만 고쳤는데도 순위가 2페이지에서 1페이지로
                  올라왔어요. 무료라서 반신반의했는데, 보고서 퀄리티에 놀랐습니다.&rdquo;
                </p>
                <p className="text-sm text-gray-500 mt-2">K사 마케팅 담당자</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: 이런 분들에게 추천합니다 ── */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm mb-2">대상 고객</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
              이런 고민이 있다면, 지금 진단 받으세요
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { q: '구글에 내 사이트를 검색해도 안 나와요', who: '신규 사이트 운영자' },
              { q: '광고비는 쓰는데 자연 유입이 너무 적어요', who: '마케팅 담당자' },
              { q: '경쟁사는 상위에 있는데 우리만 밀려요', who: '쇼핑몰 운영자' },
              { q: 'SEO를 해야 하는 건 아는데 뭘 해야 할지 모르겠어요', who: '스타트업 대표' },
              { q: '이전 대행사에서 SEO를 했다는데 효과가 없었어요', who: '마케팅 대행사 고객' },
              { q: '사이트 리뉴얼 후 트래픽이 급감했어요', who: '웹사이트 리뉴얼 기업' },
            ].map(item => (
              <div
                key={item.q}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">&ldquo;{item.q}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-1">{item.who}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: 최종 CTA (FOMO + 즉시성) ── */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cyan-400 font-semibold text-sm mb-3">지금 바로 시작하세요</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            무료 SEO 진단,
            <br />더 이상 미루지 마세요
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto">
            경쟁사와의 격차는 매일 벌어지고 있습니다.
            <br />
            10초 가입으로 지금 바로 내 사이트의 현재 상태를 확인하세요.
          </p>

          <a
            href="/login?from=lp"
            className="inline-flex items-center justify-center px-12 py-6 text-xl font-bold rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:shadow-2xl hover:scale-105 transition-all mb-4"
          >
            무료 SEO 진단 시작하기
          </a>

          <p className="text-gray-400 text-sm mb-12">
            가입 후 10초면 진단이 시작됩니다 · 카드 등록 불필요
          </p>

          {/* FAQ */}
          <div className="text-left space-y-4 max-w-lg mx-auto">
            {[
              {
                q: '정말 무료인가요?',
                a: '네, 가입 시 20만 크레딧이 지급되며 SEO 진단은 이 크레딧으로 무료 이용 가능합니다. 카드 등록도 필요 없습니다.',
              },
              {
                q: '결과는 어떻게 받나요?',
                a: '가입하신 이메일로 10~20분 내에 0~100점 종합 점수와 함께 상세 개선 보고서가 발송됩니다.',
              },
              {
                q: '진단 후 꼭 유료 서비스를 써야 하나요?',
                a: '전혀 아닙니다. 보고서에 포함된 개선안을 직접 적용하셔도 됩니다. 전문가 도움이 필요한 경우에만 추가 서비스를 이용하시면 됩니다.',
              },
              {
                q: '어떤 사이트든 진단 가능한가요?',
                a: '네, 워드프레스, 카페24, 쇼피파이 등 플랫폼에 관계없이 모든 웹사이트를 진단할 수 있습니다.',
              },
            ].map(item => (
              <div key={item.q} className="bg-white/5 backdrop-blur rounded-xl p-5">
                <p className="font-semibold text-white mb-2">Q. {item.q}</p>
                <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 하단 푸터 ── */}
      <footer className="py-8 px-4 bg-gray-900 text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2024-{new Date().getFullYear()} 백링크샵. SEO 전문 컨설팅.
        </p>
      </footer>
    </main>
  )
}
