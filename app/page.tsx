// v3.1 - 히어로 카피 개선 (구글 상위노출 강조) (2026-02-11)
/**
 * 랜딩 페이지 - 완전 정적 생성 (SSG)
 * - 빌드 시 HTML 생성 → CDN 캐싱으로 초고속 로딩
 * - 사용자별 데이터는 클라이언트 컴포넌트로 분리
 * - SEO 최적화 완료
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

// 강제 정적 생성 - 빌드 시에만 HTML 생성
export const dynamic = 'force-static'

// 이 페이지는 완전 정적 (재검증 불필요)
// revalidate 설정 없음 = 배포 시에만 재생성

export default function Home() {
  // 서버에서 유저 체크 제거 → 완전 정적 생성 가능

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* 구조화 데이터 - Google 리치 스니펫 */}
      <FAQStructuredData />
      <OrganizationStructuredData />
      <WebsiteStructuredData />
      <ServiceStructuredData />
      {/* 상단 내비게이션 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            백링크샵
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#home" className="hover:text-blue-600 transition-colors">
              홈
            </a>
            <a href="#backlink-types" className="hover:text-blue-600 transition-colors">
              백링크유형
            </a>
            <a href="#success-cases" className="hover:text-blue-600 transition-colors">
              성공사례
            </a>
            <a href="#products" className="hover:text-blue-600 transition-colors">
              상품
            </a>
            <a href="#process" className="hover:text-blue-600 transition-colors">
              프로세스
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <HeaderCTAButton />
          </div>
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section
        id="home"
        className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/30 backdrop-blur-md border border-red-300/50 text-white text-sm font-semibold mb-6 animate-pulse">
              🛑 구글 상위노출, 아직도 결과가 없으신가요?
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="text-yellow-300">구글 상위노출</span>을 위한
              <br />
              맞춤형 SEO 솔루션으로
              <br />
              <span className="underline decoration-yellow-300">2~4주 내 순위 상승</span>을
              경험하세요
            </h1>

            <div className="space-y-3 mb-8 text-lg md:text-xl text-white/95">
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>
                  <strong>도메인 · 웹사이트 · 호스팅 · 백링크</strong>까지 올인원 제공
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>
                  <strong>0부터 100까지 구축·운영·최적화</strong> 가능한 전문 업체
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>
                  <strong>주문 즉시 10분 내 작업 시작</strong>
                </span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-yellow-300 text-xl">✓</span>
                <span>
                  <strong>1,247명이 순위 상승 중</strong>
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <ClientCTAButton variant="white" size="lg" />
              <a
                href="#products"
                className="inline-flex items-center justify-center px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-xl font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                상품 보기
              </a>
            </div>

            <p className="text-white/80 text-sm">
              5분 내 시작 가능 · 카드 등록 불필요 · 가입 보너스 300 크레딧 제공
            </p>
          </div>
        </div>
      </section>

      {/* 통계 섹션 - 검은 배경 */}
      <section id="stats" className="py-16 md:py-24 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-8">
                <div>
                  <div className="text-5xl font-bold text-white mb-2">10+</div>
                  <div className="text-gray-300 font-semibold">백링크 유형</div>
                  <div className="text-gray-500 text-xs mt-1">국내 최다 보유</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">1,247</div>
                  <div className="text-gray-300 font-semibold">프로젝트 진행</div>
                  <div className="text-gray-500 text-xs mt-1">현재 진행 중</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">98%</div>
                  <div className="text-gray-300 font-semibold">재구매율</div>
                  <div className="text-gray-500 text-xs mt-1">100명 중 98명</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-2">10분</div>
                  <div className="text-gray-300 font-semibold">작업 시작</div>
                  <div className="text-gray-500 text-xs mt-1">주문 즉시 자동 진행</div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 text-center">
                <p className="text-white text-xl md:text-2xl font-bold mb-4">
                  <span className="text-red-400">이미 수백만 원 낭비하셨나요?</span>
                </p>
                <p className="text-gray-300 text-lg">
                  망설이는 동안 경쟁사는 1페이지를 차지하고, 당신의 고객을 빼앗아갑니다
                  <br />
                  <strong className="text-yellow-300">
                    지금이라도 바꾸지 않으면 내일은 더 늦습니다
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 경쟁사 비판 섹션 */}
      <section className="py-16 md:py-24 bg-red-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">⚠️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              95%의 국내 SEO 업체는
              <br />
              당신을 속이고 있습니다
            </h2>
            <p className="text-xl text-white/90">
              대부분의 국내 백링크 업체는 <strong className="text-yellow-300">KWORK, FIVERR</strong>{' '}
              같은
              <br />
              해외 플랫폼에서 저렴한 스팸 SEO를 구매해 재판매합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl bg-red-800/50 border border-red-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">❌ 일반 SEO 업체의 진실</h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl">✕</span>
                  <span>
                    <strong className="text-red-300">KWORK/FIVERR에서 $5~20에 구매</strong> → 스팸
                    링크를 고가에 재판매
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl">✕</span>
                  <span>
                    <strong className="text-red-300">스팸 링크를 고가에 재판매</strong> → 전혀 효과
                    없음
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl">✕</span>
                  <span>
                    <strong className="text-red-300">프로 없고 오히려 패널티 위험</strong> → 1년
                    노력 물거품
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1 font-bold text-xl">✕</span>
                  <span>
                    <strong className="text-red-300">책임은 고객에게 전가</strong> → 환불도 안 됨
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-green-900/50 border border-green-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6">✅ 백링크샵은 다릅니다</h3>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl">✓</span>
                  <span>
                    <strong className="text-green-300">직접 구축한 PBN 네트워크</strong> → 완전히
                    우리 것
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl">✓</span>
                  <span>
                    <strong className="text-green-300">10가지 이상 백링크 유형 직접 운영</strong> →
                    WEB2.0, EDU, GOV, Wiki 등
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl">✓</span>
                  <span>
                    <strong className="text-green-300">주문 즉시 10분 내 작업 시작</strong> → 자동
                    처리
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1 font-bold text-xl">✓</span>
                  <span>
                    <strong className="text-green-300">투명한 프로세스와 리포트</strong> → 엑셀
                    리포트 제공
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

      {/* 10가지 백링크 유형 상세 섹션 */}
      <section id="backlink-types" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">📦</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              10가지 이상 백링크 유형으로
              <br />
              자연스러운 링크 프로필 구축
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              구글은 다양한 소스에서 자연스럽게 생긴 백링크를 선호합니다
              <br />
              <strong className="text-blue-600">
                백링크샵은 10가지 이상의 백링크 유형을 직접 운영
              </strong>
              합니다
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* WEB 2.0 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WEB 2.0 백링크</h3>
              <p className="text-sm text-gray-600">WordPress, Blogger, Tumblr 등 고품질 플랫폼</p>
            </div>

            {/* 프로필 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">프로필 백링크</h3>
              <p className="text-sm text-gray-600">권위있는 사이트의 프로필 페이지 링크</p>
            </div>

            {/* EDU 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">EDU 백링크</h3>
              <p className="text-sm text-gray-600">교육 기관 도메인에서 강력한 신뢰도</p>
            </div>

            {/* GOV 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">GOV 백링크</h3>
              <p className="text-sm text-gray-600">정부 기관 도메인에서 최고 권위</p>
            </div>

            {/* WIKI 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">WIKI 백링크</h3>
              <p className="text-sm text-gray-600">위키 사이트에서 지식 기반 링크</p>
            </div>

            {/* 포럼 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">포럼 백링크</h3>
              <p className="text-sm text-gray-600">활발한 커뮤니티 포럼에서 자연스러운 링크</p>
            </div>

            {/* 게스트 포스트 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-green-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">✍️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">게스트 포스트 백링크</h3>
              <p className="text-sm text-gray-600">관련성 높은 블로그에 기고 형식</p>
            </div>

            {/* 소셜 북마크 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">🔖</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">소셜 북마크 백링크</h3>
              <p className="text-sm text-gray-600">Reddit, Pinterest 등 소셜 플랫폼</p>
            </div>

            {/* 블로그 댓글 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">💭</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">블로그 댓글 백링크</h3>
              <p className="text-sm text-gray-600">관련 블로그에 자연스러운 댓글 링크</p>
            </div>

            {/* 디렉토리 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-gray-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">📂</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">디렉토리 백링크</h3>
              <p className="text-sm text-gray-600">권위있는 디렉토리 사이트 등록</p>
            </div>

            {/* 기타 백링크 */}
            <div className="rounded-2xl bg-white border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">그 외 다수</h3>
              <p className="text-sm text-gray-600">프레스 릴리스, 문서 공유, Q&A 등</p>
            </div>

            {/* PBN */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 border-2 border-blue-500 p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-white mb-2">PBN 백링크</h3>
              <p className="text-sm text-white/90">직접 구축한 고품질 PBN 네트워크</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🔗</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                티어2, 티어3 구조 지원으로 강력한 링크 파워 전달
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">티어1</div>
                <p className="text-gray-600">
                  고품질 백링크
                  <br />→ 고객 사이트
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-cyan-600 mb-2">티어2</div>
                <p className="text-gray-600">
                  중간 링크
                  <br />→ 티어1 강화
                </p>
              </div>
              <div>
                <div className="text-4xl font-bold text-teal-600 mb-2">티어3</div>
                <p className="text-gray-600">
                  대량 링크
                  <br />→ 티어2 강화
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 성공 사례 섹션 */}
      <section id="success-cases" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              1,247개 프로젝트에서 증명된
              <br />
              실제 순위 상승 사례
            </h2>
            <p className="text-xl text-gray-600">말보다 증거. 백링크샵 고객들의 진짜 성과입니다</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* 의류 쇼핑몰 A사 */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4">👗</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">의류 쇼핑몰 A사</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">순위</span>
                  <span className="font-bold text-gray-900">
                    47위 → <span className="text-green-600 text-xl">3위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">기간</span>
                  <span className="font-bold text-gray-900">3주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">월 방문자</span>
                  <span className="font-bold text-gray-900">
                    320 → <span className="text-blue-600 text-xl">4,200명</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">월 매출 증가</p>
                  <p className="text-2xl font-bold text-gray-900">+1,850만 원</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;3주 만에 이런 결과가 나올 줄 몰랐습니다. 매출이 13배 뛰었어요!&rdquo;
              </p>
            </div>

            {/* 치과 클리닉 B */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4">🦷</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">치과 클리닉 B</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">순위</span>
                  <span className="font-bold text-gray-900">
                    검색 안됨 → <span className="text-green-600 text-xl">7위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">기간</span>
                  <span className="font-bold text-gray-900">5주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">월 예약</span>
                  <span className="font-bold text-gray-900">
                    12건 → <span className="text-blue-600 text-xl">89건</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-2xl font-bold text-gray-900">1,240%</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;검색에 안 뜨던 사이트가 이제는 예약이 밀려요. 감사합니다!&rdquo;
              </p>
            </div>

            {/* 마케팅 툴 C사 */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">마케팅 툴 C사</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">순위</span>
                  <span className="font-bold text-gray-900">
                    23위 → <span className="text-green-600 text-xl">2위</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">기간</span>
                  <span className="font-bold text-gray-900">4주</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">전환율</span>
                  <span className="font-bold text-gray-900">
                    1.2% → <span className="text-blue-600 text-xl">4.8%</span>
                  </span>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg text-center">
                  <p className="text-sm text-gray-600">MRR 증가</p>
                  <p className="text-2xl font-bold text-gray-900">+$12,400</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">
                &ldquo;SaaS 비즈니스에 SEO가 이렇게 효과적일 줄 몰랐습니다!&rdquo;
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-yellow-300 text-center">
            <p className="text-2xl font-bold text-gray-900 mb-4">
              ⚡ 평균 2~4주 내 초기 순위 변화 시작
            </p>
            <p className="text-lg text-gray-700">
              고객들은 평균 <strong className="text-blue-600">327% 트래픽 증가</strong>와<br />
              <strong className="text-green-600">892% ROI</strong>를 경험했습니다
            </p>
          </div>

          <div className="mt-12 text-center">
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* Use Case 섹션 */}
      <section id="usecase" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">👥</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              백링크샵, 이런 분들께 가장 필요합니다
            </h2>
            <p className="text-xl text-gray-600">
              이미 수천 명의 마케터, 사업가, 에이전시가 선택했습니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 이커머스 운영자 */}
            <div className="rounded-2xl bg-white border-2 border-blue-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-6xl mb-4 text-center">🛒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">이커머스 운영자</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>상품 페이지 순위 상승</strong>
                    <br />
                    상위 노출로 매출 직결
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>자연 유입 증가</strong>
                    <br />
                    광고비 절감 효과
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>전환율 개선</strong>
                    <br />
                    검색 유입이 가장 구매율 높음
                  </span>
                </li>
              </ul>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">평균 매출 증가</p>
                <p className="text-3xl font-bold text-blue-600">+327%</p>
              </div>
            </div>

            {/* 스타트업 마케터 */}
            <div className="rounded-2xl bg-white border-2 border-green-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-6xl mb-4 text-center">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">스타트업 마케터</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>브랜드 인지도 확대</strong>
                    <br />
                    검색 1페이지가 곧 신뢰도
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>빠른 SEO 성과</strong>
                    <br />
                    2~4주 내 순위 변화
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>한정된 예산 최적화</strong>
                    <br />
                    무료 크레딧으로 시작
                  </span>
                </li>
              </ul>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">평균 ROI</p>
                <p className="text-3xl font-bold text-green-600">892%</p>
              </div>
            </div>

            {/* 마케팅 에이전시 */}
            <div className="rounded-2xl bg-white border-2 border-purple-200 p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-6xl mb-4 text-center">🏢</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">마케팅 에이전시</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>클라이언트 성과 증명</strong>
                    <br />
                    눈에 보이는 순위 상승
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>투명한 리포트</strong>
                    <br />
                    엑셀 리포트로 보고 간편
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-600 mt-1 text-xl">✓</span>
                  <span className="text-gray-700">
                    <strong>안정적 파트너십</strong>
                    <br />
                    화이트라벨 옵션 제공
                  </span>
                </li>
              </ul>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">재구매율</p>
                <p className="text-3xl font-bold text-purple-600">98%</p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600 mb-6">
              당신의 비즈니스 상황에 맞는 맞춤 전략을 제안해드립니다
            </p>
            <ClientCTAButton variant="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* 컨설팅 프로세스 섹션 */}
      <section id="process" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">💡</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              작업 전 사이트 진단과 맞춤 전략 제안
            </h2>
            <p className="text-xl text-gray-600 mb-4">단순히 백링크만 걸어드리지 않습니다</p>
            <p className="text-lg text-gray-500">
              사이트 상태를 먼저 진단하고, 최적의 전략을 제안한 후에 작업을 진행합니다
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            {/* 1단계: 사이트 상태 진단 */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4 text-center">1️⃣</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">사이트 상태 진단</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 현재 백링크 프로필 분석</li>
                <li>✓ 기술적 SEO 상태 점검</li>
                <li>✓ 경쟁사 비교 분석</li>
                <li>✓ 키워드 순위 현황 파악</li>
              </ul>
            </div>

            {/* 2단계: 사이트 수정 사항 안내 */}
            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4 text-center">2️⃣</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                사이트 수정 사항 안내
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 필수 수정 사항 목록</li>
                <li>✓ 온페이지 최적화 가이드</li>
                <li>✓ 내부 링크 구조 개선안</li>
                <li>✓ 콘텐츠 개선 제안</li>
              </ul>
            </div>

            {/* 3단계: 맞춤 전략 제안 */}
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4 text-center">3️⃣</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">맞춤 전략 제안</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 백링크 유형별 조합</li>
                <li>✓ 티어 구조 설계</li>
                <li>✓ 타임라인 계획</li>
                <li>✓ 예산 최적화 방안</li>
              </ul>
            </div>

            {/* 4단계: 백링크 작업 진행 */}
            <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4 text-center">4️⃣</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">백링크 작업 진행</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 주문 즉시 자동 시작</li>
                <li>✓ 실시간 진행 상황 확인</li>
                <li>✓ 완료 후 엑셀 리포트</li>
                <li>✓ 순위 변화 모니터링</li>
              </ul>
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-center text-white shadow-xl">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              예산은 고객이 정하되, 최적의 전략은 우리가 제안합니다
            </h3>
            <p className="text-lg text-white/90 mb-6">
              무료 300 크레딧으로 진단 + 전략 제안을 먼저 받아보세요
              <br />
              <strong className="text-yellow-300">만족하시면 그때 결제하시면 됩니다</strong>
            </p>
            <ClientCTAButton variant="white" size="lg" />
          </div>
        </div>
      </section>

      {/* 서비스 상품 섹션 */}
      <section id="products" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              맞춤형 SEO 솔루션으로 필요한 것만 선택하세요
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* 플랜 백링크 */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">플랜 백링크</h3>
              <p className="text-gray-600 text-sm mb-4">
                10가지 이상 백링크 유형으로 자연스러운 링크 프로필 구축
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ 10가지 이상 백링크 유형</li>
                <li>✓ 티어2, 티어3 구조 지원</li>
                <li>✓ 다양한 조합 제공</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">200,000 크레딧~</p>
              <Link
                href="/products"
                className="block text-center py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                자세히 보기
              </Link>
            </div>

            {/* PBN 백링크 */}
            <div className="rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all relative">
              <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                ⭐ 인기
              </div>
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">PBN 백링크</h3>
              <p className="text-gray-600 text-sm mb-4">
                직접 구축한 고품질 PBN 네트워크로 강력한 순위 상승
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ 직접 구축한 네트워크</li>
                <li>✓ 고품질 보장</li>
                <li>✓ 티어 구조 지원</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">300,000 크레딧~</p>
              <Link
                href="/products"
                className="block text-center py-3 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                자세히 보기
              </Link>
            </div>

            {/* 내부 최적화 */}
            <div className="rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-5xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">내부 최적화 작업</h3>
              <p className="text-gray-600 text-sm mb-4">사이트 기술적 SEO와 온페이지 최적화</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ 사이트 기술적 SEO</li>
                <li>✓ 온페이지 최적화</li>
                <li>✓ 빠른 속도 개선</li>
              </ul>
              <p className="text-2xl font-bold text-gray-900 mb-4">200,000 크레딧~</p>
              <Link
                href="/products"
                className="block text-center py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                자세히 보기
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-lg font-bold rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              더 많은 서비스 상품 보러가기 →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">❓</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">자주 묻는 질문</h2>
            <p className="text-lg text-gray-600 mt-4">백링크샵을 시작하기 전에 궁금한 모든 것</p>
          </div>

          {/* FAQ 리스트 (6개 핵심 질문 - SEO 최적화) */}
          <FAQList />

          {/* 추가 문의 CTA */}
          <div className="max-w-4xl mx-auto mt-12 text-center">
            <p className="text-gray-600 mb-4">더 궁금한 점이 있으신가요?</p>
            <ClientCTAButton variant="primary" size="lg" />
          </div>

          <div className="max-w-4xl mx-auto space-y-6 hidden">
            {/* 서비스 차별화 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 일반 백링크 업체와 백링크샵의 차이는 무엇인가요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-600">백링크샵은 100% 자체 인프라를 운영합니다.</strong>{' '}
                95%의 업체는 KWORK/FIVERR에서 저렴한 스팸 SEO를 $5~20에 구매해 재판매하지만,
                백링크샵은 직접 구축·운영하는 PBN과 10가지 이상 백링크 유형을 보유했습니다. 주문
                즉시 10분 내 작업이 자동으로 시작되며, 완료 후에는 상세한 엑셀 리포트를 제공합니다.{' '}
                <strong className="text-gray-900">중간 마진 없이 순수한 가격</strong>으로
                제공합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 왜 95% 업체는 KWORK/FIVERR를 사용하나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-purple-600">
                  자체 인프라 구축 비용이 수천만 원 이상이기 때문입니다.
                </strong>{' '}
                대부분의 업체는 PBN을 직접 구축하지 못하고, 해외 플랫폼에서 저렴한 링크를 구매해
                고가에 재판매합니다. 하지만 이런 링크는 수백 개 사이트에 동시 판매되는 스팸 링크로,
                효과가 없거나 오히려 패널티 위험이 있습니다. 백링크샵은 초기 투자 수천만 원을 들여
                직접 PBN을 구축했고,{' '}
                <strong className="text-gray-900">100% 독점 링크만 제공</strong>합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 백링크샵은 정말 직접 구축한 PBN인가요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-600">네, 100% 자체 구축 PBN입니다.</strong> 우리는
                도메인 구매부터 호스팅, 콘텐츠 생성, 관리까지 모든 것을 직접 운영합니다. 각 PBN
                사이트는 고유한 IP, 다양한 호스팅 제공업체, 자연스러운 콘텐츠를 보유하고 있습니다.
                의류 쇼핑몰 A사는 우리 PBN으로 3주 만에 47위에서 3위로 상승했고, 치과 클리닉 B는 5주
                만에 검색 안 되던 상태에서 7위로 진입했습니다.{' '}
                <strong className="text-gray-900">이것이 직접 구축한 PBN의 힘</strong>입니다.
              </p>
            </div>

            {/* 안전성/품질 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. PBN이 안전한가요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-yellow-600">네, 고품질 PBN은 매우 안전합니다.</strong>{' '}
                저품질 PBN이 위험한 이유는 같은 IP, 같은 호스팅, 스팸 콘텐츠 때문입니다. 백링크샵은
                각 사이트를 서로 다른 호스팅, 다양한 IP, 고유한 콘텐츠로 운영하며, 자연스러운 분산
                링킹으로 패널티 위험을 제로로 만듭니다. 지난 3년간 1,247개 프로젝트에서{' '}
                <strong className="text-gray-900">패널티 사례 0건</strong>을 기록 중입니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 패널티 받을 위험은 없나요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-red-600">
                  저품질 링크를 사용하지 않는 한 패널티 위험은 거의 없습니다.
                </strong>{' '}
                구글이 패널티를 주는 경우는 스팸 링크, 대량 자동 링크, 동일 패턴 반복 등입니다.
                백링크샵은 자연스러운 링크 프로필 구축을 최우선으로 하며, 10가지 이상 백링크 유형을
                조합해 다양성을 확보합니다. 또한 작업 전 사이트 진단을 통해{' '}
                <strong className="text-gray-900">위험 요소를 사전에 제거</strong>합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 저품질 백링크와 고품질 백링크의 차이는?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-indigo-600">
                  저품질은 스팸 사이트에서 자동 생성되는 링크, 고품질은 관련성 있는 사이트에서
                  자연스럽게 생성되는 링크입니다.
                </strong>{' '}
                저품질 링크는 효과가 없거나 오히려 순위를 떨어뜨리지만, 고품질 링크는 도메인 신뢰도,
                관련성, 앵커 텍스트 다양성을 갖추고 있습니다. 백링크샵은 고품질 사이트, 관련 콘텐츠,
                자연스러운 앵커 텍스트를 보장하며,{' '}
                <strong className="text-gray-900">효과 없으면 전액 환불</strong>합니다.
              </p>
            </div>

            {/* 효과/성과 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-cyan-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 백링크 효과는 언제부터 나타나나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-cyan-600">
                  평균 2-4주 내에 초기 순위 변화가 나타납니다.
                </strong>{' '}
                의류 쇼핑몰 A사는 3주 만에 47위에서 3위로 상승했고, 치과 클리닉 B는 5주 만에 검색 안
                되던 상태에서 7위로 진입했습니다. 마케팅 툴 C사는 4주 만에 23위에서 2위로
                올랐습니다. 단, 경쟁 강도에 따라{' '}
                <strong className="text-gray-900">3-6개월에 걸쳐 안정적으로 상승</strong>하며, 한 번
                오른 순위는 지속적으로 유지됩니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 정말 2-4주 내에 순위가 오르나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-teal-600">네, 실제 고객 사례로 증명되었습니다.</strong> 의류
                쇼핑몰 A사(3주, 47위→3위), 치과 클리닉 B(5주, 검색 안됨→7위), 마케팅 툴 C사(4주,
                23위→2위) 등 수백 개 프로젝트에서 동일한 결과를 보였습니다. 하지만 키워드 경쟁도,
                사이트 상태, 백링크 유형에 따라 차이가 있으며,{' '}
                <strong className="text-gray-900">경쟁이 심한 키워드는 3-6개월 소요</strong>될 수
                있습니다. 무료 컨설팅에서 예상 기간을 정확히 알려드립니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 경쟁이 심한 키워드도 가능한가요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-pink-600">
                  네, 가능합니다. 단, 더 많은 백링크와 시간이 필요합니다.
                </strong>{' '}
                예를 들어 &ldquo;보험&rdquo;, &ldquo;대출&rdquo;, &ldquo;부동산&rdquo; 같은 초경쟁
                키워드는 6-12개월이 소요되며, 티어2/티어3 구조로 강력한 링크 파워를 전달해야 합니다.
                반면 롱테일 키워드나 지역 키워드는 2-4주 내 빠른 성과가 가능합니다.{' '}
                <strong className="text-gray-900">
                  무료 컨설팅에서 키워드별 전략과 예상 비용을 제시
                </strong>
                해드립니다.
              </p>
            </div>

            {/* 가격/크레딧 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-orange-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 소량으로 테스트할 수 있나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-orange-600">
                  네, 가입 시 무료 300 크레딧을 제공합니다.
                </strong>{' '}
                300 크레딧으로 플랜 백링크 1개 또는 사이트 진단 + 맞춤 전략 제안을 받을 수 있습니다.
                리스크 없이 우리의 품질을 먼저 경험해보세요. 만족하시면 그때 결제하시면 되며,{' '}
                <strong className="text-gray-900">98%의 고객이 재구매</strong>합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-lime-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 크레딧 시스템은 어떻게 작동하나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-lime-600">
                  크레딧은 모든 서비스에 사용할 수 있는 포인트입니다.
                </strong>{' '}
                1크레딧 = 1원 가치를 가지며, 플랜 백링크(200,000 크레딧~), PBN 백링크(300,000
                크레딧~), 내부 최적화(200,000 크레딧~) 등 다양한 서비스에 사용 가능합니다. 크레딧은
                무제한 보관되며 만료일이 없습니다. 10만 크레딧 이상 충전 시{' '}
                <strong className="text-gray-900">10~50% 보너스 크레딧</strong>이 지급됩니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 무료 300 크레딧으로 무엇을 할 수 있나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-amber-600">
                  사이트 진단 + 맞춤 전략 제안 또는 플랜 백링크 1개를 받을 수 있습니다.
                </strong>{' '}
                사이트 진단에서는 현재 백링크 프로필 분석, 기술적 SEO 점검, 경쟁사 비교, 키워드 순위
                현황을 파악하고, 맞춤 전략(백링크 유형, 티어 구조, 타임라인, 예산)을 제안합니다.
                또는 플랜 백링크 1개(WEB2.0, 프로필, 포럼 등)로{' '}
                <strong className="text-gray-900">직접 효과를 테스트</strong>할 수도 있습니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-rose-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 환불이 가능한가요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-rose-600">
                  네, 작업 미진행 시 100% 환불, 효과 없을 시 부분 환불이 가능합니다.
                </strong>{' '}
                주문 후 작업 시작 전에는 100% 환불, 작업 완료 후 90일 내 순위 변화가 전혀 없으면 50%
                환불해드립니다. 단, 사이트 수정 권장사항을 이행하지 않았거나, 구글 가이드라인 위반
                사이트는 환불 대상에서 제외됩니다.{' '}
                <strong className="text-gray-900">3년간 환불 요청 0.8%</strong>로 고객 만족도가 매우
                높습니다.
              </p>
            </div>

            {/* 프로세스 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-violet-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 주문 후 얼마나 빨리 시작되나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-violet-600">
                  주문 즉시 10분 내 자동으로 작업이 시작됩니다.
                </strong>{' '}
                수동 처리가 아닌 자동화 시스템으로 운영되어, 결제 완료 후 10분 이내에 백링크 작업이
                진행됩니다. 대시보드에서 실시간 진행 상황을 확인할 수 있으며, 작업 완료 시 이메일
                알림과 함께{' '}
                <strong className="text-gray-900">
                  상세 엑셀 리포트(URL, 앵커 텍스트 등)를 제공
                </strong>
                합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-fuchsia-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 어떤 리포트를 제공받나요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-fuchsia-600">
                  작업 완료 후 상세 엑셀 리포트를 제공합니다.
                </strong>{' '}
                리포트에는 백링크 URL, 도메인 신뢰도, 앵커 텍스트, 백링크 유형, 작업 일자가
                포함됩니다. 또한 구글 서치 콘솔 데이터와 연동하여 백링크 인덱싱 상태를 추적하고,{' '}
                <strong className="text-gray-900">매주 순위 변화 리포트</strong>를 이메일로
                발송합니다. 투명한 프로세스로 신뢰를 드립니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-sky-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 진행 상황은 어떻게 확인하나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-sky-600">
                  대시보드에서 실시간으로 확인할 수 있습니다.
                </strong>{' '}
                주문 내역, 진행 중인 작업, 완료된 백링크 수, 사용한 크레딧, 남은 크레딧 등 모든
                정보가 한눈에 보입니다. 또한 각 주문별로 상세 페이지에서 백링크 리스트, 인덱싱 상태,
                순위 변화 그래프를 확인할 수 있으며,{' '}
                <strong className="text-gray-900">모바일에서도 동일하게 이용</strong> 가능합니다.
              </p>
            </div>

            {/* 기술적 질문 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 어떤 백링크 유형을 선택해야 하나요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-emerald-600">사이트 상태와 목표에 따라 다릅니다.</strong>{' '}
                신규 사이트는 플랜 백링크로 다양한 링크 프로필을 먼저 구축하고, 기존 사이트는 PBN
                백링크로 강력한 링크 파워를 전달하는 것이 효과적입니다. 무료 컨설팅에서 사이트 진단
                후 <strong className="text-gray-900">맞춤 백링크 조합을 제안</strong>해드립니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 플랜 백링크와 PBN 백링크의 차이는?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-blue-600">
                  플랜 백링크는 다양성, PBN 백링크는 강력함에 초점을 둡니다.
                </strong>{' '}
                플랜 백링크는 10가지 이상 유형(WEB2.0, EDU, GOV, Wiki 등)을 조합해 자연스러운 링크
                프로필을 만들고, PBN 백링크는 직접 구축한 고권위 사이트에서 강력한 링크 파워를
                전달합니다.{' '}
                <strong className="text-gray-900">
                  일반적으로 플랜 백링크로 기반을 다지고 PBN으로 순위를 끌어올립니다
                </strong>
                .
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 티어 링크란 무엇인가요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-purple-600">
                  티어 링크는 백링크를 가리키는 백링크로, 링크 파워를 증폭시킵니다.
                </strong>{' '}
                티어1(고객 사이트로 직접 연결), 티어2(티어1 백링크를 가리킴), 티어3(티어2 백링크를
                가리킴) 구조로, 피라미드처럼 링크 파워를 전달합니다. 예를 들어 PBN 백링크(티어1)
                10개에 플랜 백링크(티어2) 100개를 연결하면,{' '}
                <strong className="text-gray-900">티어1 백링크의 권위가 10배 강해집니다</strong>.
                경쟁 키워드에 필수적입니다.
              </p>
            </div>

            {/* 산업/대상 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-teal-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">
                Q. 모든 산업군에 적용 가능한가요?
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-teal-600">
                  네, 이커머스, 서비스업, B2B, SaaS, 블로그 등 모든 산업에 적용 가능합니다.
                </strong>{' '}
                의류 쇼핑몰(47위→3위), 치과 클리닉(검색 안됨→7위), 마케팅 툴(23위→2위), 법률 사무소,
                부동산, 온라인 교육, 헬스케어 등 1,247개 프로젝트에서 검증되었습니다. 단, 도박,
                성인, 불법 사이트는 <strong className="text-gray-900">서비스 제공이 불가능</strong>
                합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-cyan-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 신규 사이트도 가능한가요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-cyan-600">
                  네, 신규 사이트도 가능하지만 전략이 다릅니다.
                </strong>{' '}
                신규 사이트(도메인 나이 3개월 미만)는 갑작스런 대량 백링크가 부자연스러우므로, 플랜
                백링크를 천천히 쌓아가는 전략을 추천합니다. 월 10-20개씩 3-6개월에 걸쳐 자연스럽게
                구축하면,{' '}
                <strong className="text-gray-900">신규 사이트도 6개월 내 1페이지 진입</strong>이
                가능합니다. 무료 컨설팅에서 신규 사이트 맞춤 전략을 제시합니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-all">
              <p className="font-bold text-gray-900 mb-3 text-lg">Q. 해외 사이트도 가능한가요?</p>
              <p className="text-gray-700 leading-relaxed">
                <strong className="text-green-600">
                  네, 영어 사이트는 물론 다국어 사이트도 가능합니다.
                </strong>{' '}
                우리의 PBN과 백링크 네트워크는 주로 영어 기반이므로, 오히려 영어 사이트가 더
                효과적입니다. 한국어 사이트도 가능하지만, 앵커 텍스트와 콘텐츠를 한국어로 작성하기
                위해 추가 비용이 발생할 수 있습니다.{' '}
                <strong className="text-gray-900">
                  영어 사이트는 한국어 사이트보다 20-30% 저렴
                </strong>
                합니다.
              </p>
            </div>
          </div>

          {/* FAQ JSON-LD 스키마 (6개 핵심 질문) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: '일반 백링크 업체와 백링크샵의 차이는 무엇인가요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '백링크샵은 100% 자체 인프라를 운영합니다. 95%의 업체는 KWORK/FIVERR에서 저렴한 스팸 SEO를 $5~20에 구매해 재판매하지만, 백링크샵은 직접 구축·운영하는 PBN과 10가지 이상 백링크 유형을 보유했습니다. 주문 즉시 10분 내 작업이 자동으로 시작되며, 완료 후에는 상세한 엑셀 리포트를 제공합니다. 중간 마진 없이 순수한 가격으로 제공합니다.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'PBN이 안전한가요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '네, 고품질 PBN은 매우 안전합니다. 저품질 PBN이 위험한 이유는 같은 IP, 같은 호스팅, 스팸 콘텐츠 때문입니다. 백링크샵은 각 사이트를 서로 다른 호스팅, 다양한 IP, 고유한 콘텐츠로 운영하며, 자연스러운 분산 링킹으로 패널티 위험을 제로로 만듭니다. 지난 3년간 1,247개 프로젝트에서 패널티 사례 0건을 기록 중입니다.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '백링크 효과는 언제부터 나타나나요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '평균 2-4주 내에 초기 순위 변화가 나타납니다. 의류 쇼핑몰 A사는 3주 만에 47위에서 3위로 상승했고, 치과 클리닉 B는 5주 만에 검색 안 되던 상태에서 7위로 진입했습니다. 마케팅 툴 C사는 4주 만에 23위에서 2위로 올랐습니다. 단, 경쟁 강도에 따라 3-6개월에 걸쳐 안정적으로 상승하며, 한 번 오른 순위는 지속적으로 유지됩니다.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '소량으로 테스트할 수 있나요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '네, 가입 시 무료 300 크레딧을 제공합니다. 300 크레딧으로 플랜 백링크 1개 또는 사이트 진단 + 맞춤 전략 제안을 받을 수 있습니다. 리스크 없이 우리의 품질을 먼저 경험해보세요. 만족하시면 그때 결제하시면 되며, 98%의 고객이 재구매합니다.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '주문 후 얼마나 빨리 시작되나요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '주문 즉시 10분 내 자동으로 작업이 시작됩니다. 수동 처리가 아닌 자동화 시스템으로 운영되어, 결제 완료 후 10분 이내에 백링크 작업이 진행됩니다. 대시보드에서 실시간 진행 상황을 확인할 수 있으며, 작업 완료 시 이메일 알림과 함께 상세 엑셀 리포트를 제공합니다.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: '환불이 가능한가요?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '네, 작업 미진행 시 100% 환불, 효과 없을 시 부분 환불이 가능합니다. 주문 후 작업 시작 전에는 100% 환불, 작업 완료 후 90일 내 순위 변화가 전혀 없으면 50% 환불해드립니다. 3년간 환불 요청 0.8%로 고객 만족도가 매우 높습니다.',
                    },
                  },
                ],
              }),
            }}
          />
        </div>
      </section>

      {/* 마지막 CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-8xl mb-6">🚀</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              더 이상 망설이지 마세요!
              <br />
              지금 시작하지 않으면 경쟁사에게 밀립니다
            </h2>
            <p className="text-xl text-white/90 mb-8">
              <strong className="text-yellow-300">무료 300 크레딧</strong>으로 먼저 테스트하고
              결정하세요
            </p>
            <ClientCTAButton variant="white" size="lg" className="!text-2xl !px-12 !py-6" />
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* 회사 정보 */}
            <div>
              <Link href="/" className="text-2xl font-bold text-white mb-4 block">
                백링크샵
              </Link>
              <p className="text-gray-400 mb-4">
                직접 구축한 PBN과 10가지 이상 백링크 유형으로
                <br />
                2~4주 내 순위 상승을 경험하세요
              </p>
            </div>

            {/* 서비스 */}
            <div>
              <h3 className="text-white font-bold mb-4">서비스</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    플랜 백링크
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    PBN 백링크
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    내부 최적화
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    사이트 제작
                  </Link>
                </li>
              </ul>
            </div>

            {/* 회사 */}
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

            {/* 고객지원 */}
            <div>
              <h3 className="text-white font-bold mb-4">고객지원</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    문의하기
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

          {/* 하단 */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>© 2026 백링크샵. All rights reserved.</p>
            <p className="mt-2">
              <strong className="text-gray-400">1,247개 프로젝트</strong>가 백링크샵으로 순위를
              올렸습니다
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
