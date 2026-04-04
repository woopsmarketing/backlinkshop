/**
 * 랜딩 페이지 - SSG (force-static)
 * 타겟 키워드: 구글SEO, 구글상위노출, 백링크, 고품질백링크, PBN백링크, SEO백링크, 검색엔진최적화, 도메인분석
 */

import Link from 'next/link'
import { ClientCTAButton, HeaderCTAButton } from '@/app/components/ClientCTAButton'
import {
  FAQStructuredData,
  OrganizationStructuredData,
  WebsiteStructuredData,
  ServiceStructuredData,
} from '@/app/components/StructuredData'
import { FAQList } from '@/app/components/FAQList'

export const dynamic = 'force-static'

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <FAQStructuredData />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <ServiceStructuredData />

      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            백링크샵
          </Link>
          <nav
            className="hidden md:flex items-center gap-6 text-sm text-gray-600"
            aria-label="메인 네비게이션"
          >
            <a href="#home" className="hover:text-blue-600 transition-colors">
              홈
            </a>
            <a href="#backlink-types" className="hover:text-blue-600 transition-colors">
              백링크 유형
            </a>
            <a href="#success-cases" className="hover:text-blue-600 transition-colors">
              구글 상위노출 사례
            </a>
            <a href="#domain-analysis" className="hover:text-blue-600 transition-colors">
              무료 도메인 분석
            </a>
            <a href="#products" className="hover:text-blue-600 transition-colors">
              SEO 백링크 상품
            </a>
            <a href="#process" className="hover:text-blue-600 transition-colors">
              진행 프로세스
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://t.me/goat82"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all"
            >
              텔레그램 문의
            </a>
            <HeaderCTAButton />
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section
        id="home"
        className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
      >
        <div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          aria-hidden="true"
        ></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          aria-hidden="true"
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          aria-hidden="true"
        ></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/30 backdrop-blur-md border border-red-300/50 text-white text-sm font-semibold mb-6">
              구글SEO · 구글 상위노출, 아직도 결과가 없으신가요?
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <strong className="text-yellow-300">구글SEO</strong>와{' '}
              <strong className="text-yellow-300">구글 상위노출</strong>을 위한
              <br />
              <strong>고품질 PBN 백링크</strong>와
              <br />
              <span className="underline decoration-yellow-300">맞춤형 검색엔진최적화 솔루션</span>
            </h1>

            <div className="space-y-3 mb-8 text-lg md:text-xl text-white/95">
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl" aria-hidden="true">
                  &#10003;
                </span>
                <span>
                  직접 구축한 <strong>PBN 백링크</strong> 네트워크로 강력한 구글 상위노출
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl" aria-hidden="true">
                  &#10003;
                </span>
                <span>
                  <strong>10가지 이상 SEO 백링크</strong> 유형으로 자연스러운 검색엔진최적화
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl" aria-hidden="true">
                  &#10003;
                </span>
                <span>
                  주문 즉시 <strong>10분 내 백링크 작업 자동 시작</strong>
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl" aria-hidden="true">
                  &#10003;
                </span>
                <span>
                  <strong>1,247개 프로젝트</strong>에서 검증된 구글 상위노출 성과
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <ClientCTAButton variant="white" size="lg" />
              <a
                href="https://t.me/goat82"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-xl font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                24시간 무료 SEO 상담
              </a>
            </div>

            <p className="text-white/80 text-sm">
              5분 내 시작 가능 · 카드 등록 불필요 · 가입 보너스 30만 크레딧 ·{' '}
              <a href="#domain-analysis" className="underline hover:text-white">
                무료 도메인 분석
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* 핵심 성과 지표 */}
      <section className="py-16 md:py-24 bg-gray-900" aria-label="백링크샵 핵심 성과">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-8">
                <div>
                  <div className="text-5xl font-bold text-white mb-2">10+</div>
                  <div className="text-gray-300 font-semibold">SEO 백링크 유형</div>
                  <div className="text-gray-500 text-xs mt-1">국내 최다 보유</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">1,247</div>
                  <div className="text-gray-300 font-semibold">구글 상위노출 프로젝트</div>
                  <div className="text-gray-500 text-xs mt-1">현재 진행 중</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">98%</div>
                  <div className="text-gray-300 font-semibold">재구매율</div>
                  <div className="text-gray-500 text-xs mt-1">100명 중 98명</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">0건</div>
                  <div className="text-gray-300 font-semibold">구글 패널티</div>
                  <div className="text-gray-500 text-xs mt-1">3년간 기록</div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 text-center">
                <p className="text-white text-xl md:text-2xl font-bold mb-4">
                  <span className="text-red-400">
                    구글SEO 없이 저품질 백링크에 돈을 낭비하고 계신가요?
                  </span>
                </p>
                <p className="text-gray-300 text-lg">
                  경쟁사는 이미 구글SEO와 고품질 백링크로 구글 1페이지를 차지하고 있습니다
                  <br />
                  <strong className="text-yellow-300">
                    지금 구글 상위노출 전략을 시작하지 않으면 격차는 더 벌어집니다
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 경쟁사 비교 - 왜 고품질 백링크가 중요한가 */}
      <section className="py-16 md:py-24 bg-red-900" aria-label="일반 SEO 업체와 백링크샵 비교">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              95%의 백링크 업체는
              <br />
              저품질 스팸 링크를 판매합니다
            </h2>
            <p className="text-xl text-white/90">
              대부분의 국내 SEO 업체는 <strong className="text-yellow-300">KWORK, FIVERR</strong>
              에서
              <br />
              $5~20짜리 스팸 백링크를 구매해 재판매합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-red-800/50 border border-red-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">저품질 백링크 업체의 실체</h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10005;
                  </span>
                  <span>
                    <strong className="text-red-300">KWORK/FIVERR에서 $5~20에 구매</strong> - 스팸
                    백링크를 고가에 재판매
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10005;
                  </span>
                  <span>
                    <strong className="text-red-300">검색엔진최적화 효과 없음</strong> - 저품질
                    링크는 구글 상위노출에 도움 안 됨
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10005;
                  </span>
                  <span>
                    <strong className="text-red-300">구글 패널티 위험</strong> - 스팸 백링크로
                    1년간의 SEO 노력이 물거품
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10005;
                  </span>
                  <span>
                    <strong className="text-red-300">책임 전가</strong> - 환불도 리포트도 없음
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-green-900/50 border border-green-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">백링크샵의 고품질 백링크</h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>
                    <strong className="text-green-300">직접 구축한 PBN 백링크 네트워크</strong> -
                    100% 자체 소유·운영
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>
                    <strong className="text-green-300">10가지 이상 SEO 백링크 유형</strong> -
                    WEB2.0, EDU, GOV, Wiki 등
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>
                    <strong className="text-green-300">주문 즉시 10분 내 작업 시작</strong> - 자동화
                    시스템
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span>
                    <strong className="text-green-300">투명한 백링크 리포트</strong> - URL, 앵커
                    텍스트, DA 포함 엑셀
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <ClientCTAButton variant="white" size="lg" className="text-red-600" />
          </div>
        </div>
      </section>

      {/* 10가지 이상 SEO 백링크 유형 */}
      <section id="backlink-types" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              10가지 이상 고품질 백링크 유형으로
              <br />
              자연스러운 검색엔진최적화
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              구글은 다양한 소스에서 자연스럽게 생긴 백링크를 선호합니다.
              <br />
              <strong className="text-blue-600">
                백링크샵은 10가지 이상의 SEO 백링크 유형을 직접 운영
              </strong>
              하여 구글 상위노출을 실현합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              {
                icon: '🌐',
                name: 'WEB 2.0 백링크',
                desc: 'WordPress, Blogger, Tumblr 등 고품질 플랫폼에서 생성하는 SEO 백링크',
                border: 'border-gray-200',
              },
              {
                icon: '👤',
                name: '프로필 백링크',
                desc: '권위 있는 사이트의 프로필 페이지에서 자연스러운 백링크 구축',
                border: 'border-gray-200',
              },
              {
                icon: '🎓',
                name: 'EDU 백링크',
                desc: '교육 기관 도메인(.edu)에서 생성되는 높은 신뢰도의 고품질 백링크',
                border: 'border-blue-200',
              },
              {
                icon: '🏛️',
                name: 'GOV 백링크',
                desc: '정부 기관 도메인(.gov)에서 얻는 최고 권위의 SEO 백링크',
                border: 'border-blue-200',
              },
              {
                icon: '📚',
                name: 'Wiki 백링크',
                desc: '위키 사이트에서 지식 기반으로 생성되는 검색엔진최적화 링크',
                border: 'border-gray-200',
              },
              {
                icon: '💬',
                name: '포럼 백링크',
                desc: '활발한 커뮤니티 포럼에서 자연스럽게 생기는 SEO 백링크',
                border: 'border-gray-200',
              },
              {
                icon: '✍️',
                name: '게스트 포스트 백링크',
                desc: '관련성 높은 블로그에 기고하여 얻는 고품질 백링크',
                border: 'border-green-200',
              },
              {
                icon: '🔖',
                name: '소셜 북마크 백링크',
                desc: 'Reddit, Pinterest 등 소셜 플랫폼에서의 SEO 시그널 강화',
                border: 'border-gray-200',
              },
              {
                icon: '💭',
                name: '블로그 댓글 백링크',
                desc: '관련 블로그에 자연스러운 댓글로 생성하는 백링크',
                border: 'border-gray-200',
              },
              {
                icon: '📂',
                name: '디렉토리 백링크',
                desc: '권위 있는 디렉토리 사이트에 등록하여 구축하는 SEO 백링크',
                border: 'border-gray-200',
              },
              {
                icon: '⚡',
                name: '프레스 릴리스 외 다수',
                desc: '보도자료, 문서 공유, Q&A 등 다양한 백링크 유형 보유',
                border: 'border-purple-200',
              },
            ].map(item => (
              <div
                key={item.name}
                className={`rounded-2xl bg-white border-2 ${item.border} p-6 shadow-lg hover:shadow-xl transition-shadow`}
              >
                <div className="text-4xl mb-3" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}

            {/* PBN 백링크 - 강조 */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 border-2 border-blue-500 p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="text-4xl mb-3" aria-hidden="true">
                🏆
              </div>
              <h3 className="text-lg font-bold text-white mb-2">PBN 백링크</h3>
              <p className="text-sm text-white/90">
                직접 구축한 고품질 PBN 네트워크로 가장 강력한 구글 상위노출 효과
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                티어2, 티어3 구조로 SEO 백링크 파워를 극대화
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">티어1</div>
                <p className="text-gray-600">
                  고품질 백링크
                  <br />
                  &#8594; 고객 사이트 직접 연결
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-600 mb-2">티어2</div>
                <p className="text-gray-600">
                  중간 백링크
                  <br />
                  &#8594; 티어1 권위 강화
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">티어3</div>
                <p className="text-gray-600">
                  대량 백링크
                  <br />
                  &#8594; 티어2 파워 증폭
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 구글 상위노출 성공 사례 */}
      <section id="success-cases" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고품질 백링크로 구글 상위노출에 성공한
              <br />
              실제 검색엔진최적화 사례
            </h2>
            <p className="text-xl text-gray-600">SEO 백링크의 진짜 효과, 데이터로 증명합니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <article className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                의류 쇼핑몰 A사 - 구글 상위노출
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">구글 순위</span>
                  <span className="font-bold text-gray-900">
                    47위 &#8594; <span className="text-green-600 text-xl">3위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">SEO 기간</span>
                  <span className="font-bold text-gray-900">3주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">월 방문자</span>
                  <span className="font-bold text-gray-900">
                    320 &#8594; <span className="text-blue-600 text-xl">4,200명</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">월 매출 증가</p>
                  <p className="text-2xl font-bold text-gray-900">+1,850만 원</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;PBN 백링크로 3주 만에 구글 상위노출에 성공, 매출이 13배 증가했습니다!&rdquo;
              </p>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                치과 클리닉 B - 검색엔진최적화
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">구글 순위</span>
                  <span className="font-bold text-gray-900">
                    미검색 &#8594; <span className="text-green-600 text-xl">7위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">SEO 기간</span>
                  <span className="font-bold text-gray-900">5주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">월 예약</span>
                  <span className="font-bold text-gray-900">
                    12건 &#8594; <span className="text-blue-600 text-xl">89건</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">1,240%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;고품질 백링크 덕분에 검색에 안 뜨던 사이트에 예약이 밀립니다!&rdquo;
              </p>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                마케팅 툴 C사 - SEO 백링크 효과
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">구글 순위</span>
                  <span className="font-bold text-gray-900">
                    23위 &#8594; <span className="text-green-600 text-xl">2위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">SEO 기간</span>
                  <span className="font-bold text-gray-900">4주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">전환율</span>
                  <span className="font-bold text-gray-900">
                    1.2% &#8594; <span className="text-blue-600 text-xl">4.8%</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">MRR 증가</p>
                  <p className="text-2xl font-bold text-gray-900">+$12,400</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;SEO 백링크가 비즈니스 성장의 핵심 동력이 되었습니다!&rdquo;
              </p>
            </article>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-300 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              평균 2~4주 내 구글 상위노출 순위 변화 시작
            </p>
            <p className="text-lg text-gray-700">
              고품질 백링크로 평균 <strong className="text-blue-600">327% 트래픽 증가</strong>와{' '}
              <strong className="text-green-600">892% ROI</strong> 달성
            </p>
          </div>

          <div className="mt-12 text-center">
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 무료 도메인 분석 - 구글SEO 첫걸음 */}
      <section
        id="domain-analysis"
        className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-md border border-green-400/40 text-green-300 text-sm font-semibold mb-6">
              100% 무료 · 회원가입 불필요
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              구글 상위노출의 첫걸음,
              <br />
              <strong className="text-cyan-400">
                내 도메인과 경쟁사 도메인을 무료로 분석하세요
              </strong>
            </h2>
            <p className="text-xl text-gray-300">
              구글SEO에서 성공하려면 먼저{' '}
              <strong className="text-yellow-300">내 사이트의 현재 위치</strong>를 정확히 알아야
              합니다
              <br />
              경쟁사 대비 부족한 점을 파악하고, 데이터 기반의 구글 상위노출 전략을 세우세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#128270;
              </div>
              <h3 className="text-xl font-bold text-white mb-3">도메인 권위도 분석</h3>
              <p className="text-gray-300 text-sm">
                DA(Domain Authority), DR(Domain Rating) 등 구글SEO 핵심 지표를 한눈에 확인하고 구글
                상위노출 가능성을 진단합니다
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#128202;
              </div>
              <h3 className="text-xl font-bold text-white mb-3">경쟁사 비교 분석</h3>
              <p className="text-gray-300 text-sm">
                경쟁사의 백링크 프로필, 트래픽, 키워드 순위를 비교하여 구글 상위노출에 필요한 격차를
                정밀하게 파악합니다
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center">
              <div className="text-5xl mb-4" aria-hidden="true">
                &#128640;
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SEO 전략 인사이트</h3>
              <p className="text-gray-300 text-sm">
                분석 결과를 바탕으로 어떤 백링크가 필요한지, 어떤 키워드를 공략해야 구글 상위노출에
                유리한지 방향을 제시합니다
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-400/30 text-center mb-8">
            <p className="text-lg text-white mb-2">
              <strong className="text-cyan-400">
                백링크 구매 전, 먼저 내 도메인을 무료로 분석해보세요
              </strong>
            </p>
            <p className="text-gray-300">
              경쟁사와의 차이를 확인하면 더 정밀한 구글SEO 전략을 세울 수 있습니다.
              <br />
              100% 무료이며, 회원가입 없이 바로 이용 가능합니다.
            </p>
          </div>

          <div className="text-center">
            <a
              href="https://domainchecker.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              무료 도메인 분석 시작하기 &#8599;
            </a>
          </div>
        </div>
      </section>

      {/* 타겟 고객 */}
      <section className="py-16 md:py-24 bg-gray-50" aria-label="백링크샵 추천 대상">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              고품질 백링크와 검색엔진최적화가
              <br />
              필요한 분들께 추천합니다
            </h2>
            <p className="text-xl text-gray-600">
              이미 수천 명의 마케터, 사업가, 에이전시가 SEO 백링크를 활용 중입니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <article className="rounded-2xl bg-white border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">이커머스 운영자</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>구글 상위노출로 매출 직결</strong>
                    <br />
                    상품 페이지 SEO 순위 상승
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>백링크로 자연 유입 증가</strong>
                    <br />
                    광고비 절감 효과
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>검색 유입 전환율 최고</strong>
                    <br />
                    검색엔진최적화가 가장 효율적
                  </span>
                </li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">평균 매출 증가</p>
                <p className="text-3xl font-bold text-blue-600">+327%</p>
              </div>
            </article>

            <article className="rounded-2xl bg-white border-2 border-green-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">스타트업 마케터</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>구글 상위노출이 곧 신뢰도</strong>
                    <br />
                    백링크로 브랜드 인지도 확대
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>2~4주 내 SEO 성과</strong>
                    <br />
                    빠른 검색엔진최적화 효과
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>무료 30만 크레딧으로 시작</strong>
                    <br />
                    한정 예산 최적화
                  </span>
                </li>
              </ul>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">평균 ROI</p>
                <p className="text-3xl font-bold text-green-600">892%</p>
              </div>
            </article>

            <article className="rounded-2xl bg-white border-2 border-purple-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">마케팅 에이전시</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>클라이언트 구글 상위노출 증명</strong>
                    <br />
                    고품질 백링크로 눈에 보이는 성과
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>투명한 SEO 리포트</strong>
                    <br />
                    백링크 엑셀 리포트로 보고 간편
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl" aria-hidden="true">
                    &#10003;
                  </span>
                  <span className="text-gray-700">
                    <strong>화이트라벨 백링크 옵션</strong>
                    <br />
                    안정적 SEO 파트너십
                  </span>
                </li>
              </ul>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">재구매율</p>
                <p className="text-3xl font-bold text-purple-600">98%</p>
              </div>
            </article>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              비즈니스 상황에 맞는 맞춤 SEO 백링크 전략을 제안합니다
            </p>
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 검색엔진최적화 프로세스 */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              백링크 작업 전 SEO 진단과
              <br />
              맞춤 검색엔진최적화 전략 제안
            </h2>
            <p className="text-xl text-gray-600 mb-4">단순히 백링크만 걸어드리지 않습니다</p>
            <p className="text-lg text-gray-500">
              사이트 상태를 먼저 진단하고, 최적의 SEO 백링크 전략을 제안한 후 작업합니다
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <article className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center" aria-hidden="true">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">SEO 사이트 진단</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>&#10003; 현재 백링크 프로필 분석</li>
                <li>&#10003; 기술적 SEO 상태 점검</li>
                <li>&#10003; 경쟁사 백링크 비교 분석</li>
                <li>&#10003; 키워드 구글 순위 현황</li>
              </ul>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center" aria-hidden="true">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                온페이지 SEO 개선 안내
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>&#10003; 필수 수정 사항 목록</li>
                <li>&#10003; 온페이지 검색엔진최적화 가이드</li>
                <li>&#10003; 내부 링크 구조 개선안</li>
                <li>&#10003; 콘텐츠 SEO 개선 제안</li>
              </ul>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center" aria-hidden="true">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">맞춤 백링크 전략</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>&#10003; SEO 백링크 유형별 조합</li>
                <li>&#10003; PBN + 플랜 티어 구조 설계</li>
                <li>&#10003; 구글 상위노출 타임라인</li>
                <li>&#10003; 예산 최적화 방안</li>
              </ul>
            </article>

            <article className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4 text-center" aria-hidden="true">
                4️⃣
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">백링크 작업 진행</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>&#10003; 주문 즉시 10분 내 시작</li>
                <li>&#10003; 실시간 진행 상황 확인</li>
                <li>&#10003; 백링크 엑셀 리포트 제공</li>
                <li>&#10003; 구글 순위 변화 모니터링</li>
              </ul>
            </article>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-center text-white shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              예산은 고객이 정하되, 최적의 SEO 백링크 전략은 우리가 제안합니다
            </h3>
            <p className="text-lg text-white/90 mb-6">
              무료 30만 크레딧으로 SEO 진단과 맞춤 검색엔진최적화 전략을 먼저 받아보세요
              <br />
              <strong className="text-yellow-300">만족하시면 그때 결제하시면 됩니다</strong>
            </p>
            <ClientCTAButton variant="white" size="lg" />
          </div>
        </div>
      </section>

      {/* SEO 백링크 상품 */}
      <section id="products" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              구글 상위노출을 위한 맞춤형 SEO 백링크 상품
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* 플랜 백링크 */}
            <article className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">플랜 백링크</h3>
              <p className="text-gray-600 text-sm mb-4">
                10가지 이상 SEO 백링크 유형으로 자연스러운 검색엔진최적화 링크 프로필 구축
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>&#10003; 10가지 이상 고품질 백링크 유형</li>
                <li>&#10003; 티어2, 티어3 구조 지원</li>
                <li>&#10003; 다양한 조합으로 자연스러운 SEO</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">300,000 크레딧~</p>
              <Link
                href="/products/category/plan"
                className="block text-center py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                플랜 백링크 상품 보기
              </Link>
            </article>

            {/* PBN 백링크 */}
            <article className="rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl hover:shadow-2xl transition-shadow relative">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                인기
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PBN 백링크</h3>
              <p className="text-gray-600 text-sm mb-4">
                직접 구축한 고품질 PBN 네트워크로 강력한 구글 상위노출 효과
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>&#10003; 100% 자체 구축 PBN 백링크</li>
                <li>&#10003; 고품질 DA/DR 보장</li>
                <li>&#10003; 티어 구조로 SEO 파워 극대화</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">300,000 크레딧~</p>
              <Link
                href="/products/category/pbn"
                className="block text-center py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                PBN 백링크 상품 보기
              </Link>
            </article>

            {/* 온페이지 SEO 최적화 */}
            <article className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-2">온페이지 SEO 최적화</h3>
              <p className="text-gray-600 text-sm mb-4">
                사이트 기술적 SEO와 온페이지 검색엔진최적화
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>&#10003; 기술적 SEO 진단 및 개선</li>
                <li>&#10003; 온페이지 검색엔진최적화</li>
                <li>&#10003; 사이트 속도 및 구조 개선</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">200,000 크레딧~</p>
              <Link
                href="/products/category/seo"
                className="block text-center py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                온페이지 SEO 상품 보기
              </Link>
            </article>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              전체 SEO 백링크 상품 보기 &#8594;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ - 검색엔진최적화 관련 자주 묻는 질문 */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              백링크와 검색엔진최적화(SEO) 자주 묻는 질문
            </h2>
            <p className="text-lg text-gray-600 mt-4">
              고품질 백링크와 구글 상위노출에 대해 궁금한 모든 것
            </p>
          </div>

          <FAQList />

          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-600 mb-4">
              더 궁금한 점이 있으신가요? SEO 백링크 전문가가 답변드립니다
            </p>
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 마지막 CTA */}
      <section
        className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600"
        aria-label="시작하기"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              고품질 백링크로 구글 상위노출,
              <br />
              지금 시작하세요
            </h2>
            <p className="text-xl text-white/90 mb-8">
              <strong className="text-yellow-300">무료 30만 크레딧</strong>으로 SEO 백링크 효과를
              먼저 테스트하세요
            </p>
            <ClientCTAButton variant="white" size="lg" className="!text-2xl !px-12 !py-6" />
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Link href="/" className="text-2xl font-bold text-white mb-4 block">
                백링크샵
              </Link>
              <p className="text-gray-400 mb-4">
                직접 구축한 PBN 백링크와 10가지 이상 고품질 SEO 백링크로
                <br />
                2~4주 내 구글 상위노출을 실현합니다
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">SEO 백링크 서비스</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products/category/plan"
                    className="hover:text-white transition-colors"
                  >
                    플랜 백링크 - 검색엔진최적화 패키지
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/category/pbn"
                    className="hover:text-white transition-colors"
                  >
                    PBN 백링크 - 구글 상위노출
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/category/seo"
                    className="hover:text-white transition-colors"
                  >
                    온페이지 SEO 최적화
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/category/content"
                    className="hover:text-white transition-colors"
                  >
                    콘텐츠 SEO 최적화
                  </Link>
                </li>
                <li>
                  <a
                    href="https://domainchecker.co.kr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    무료 도메인 분석
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">회사</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    환불 정책
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">고객지원</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    백링크 FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/goat82"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    텔레그램 문의
                  </a>
                </li>
                <li className="mt-4">
                  <p className="text-sm text-gray-400">이메일</p>
                  <a
                    href="mailto:support@backlink-shop.com"
                    className="hover:text-white transition-colors"
                  >
                    support@backlink-shop.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 백링크샵. All rights reserved.</p>
            <p className="mt-2">
              <strong className="text-gray-400">1,247개 프로젝트</strong>가 고품질 백링크로 구글
              상위노출에 성공했습니다
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
