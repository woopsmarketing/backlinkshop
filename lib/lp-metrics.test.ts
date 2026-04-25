import { describe, expect, it } from 'vitest'
import {
  buildKpiCards,
  buildMetrics,
  buildOnPageDetail,
  calculateCompetitorAverage,
  calculateCompetitorGap,
  detectPlatform,
  formatMetricValue,
  isVisibleReport,
  partitionCompetitors,
  summarizeOnPage,
  trimDomainLabel,
} from './lp-metrics'

describe('buildMetrics', () => {
  it('입력이 비어있으면 빈 배열을 반환한다', () => {
    expect(buildMetrics({})).toEqual([])
  })

  it('적정 제목 길이를 good 으로 분류한다', () => {
    const [m] = buildMetrics({ title: 'SEO 최적화된 제목입니다', titleLength: 13 })
    expect(m.label).toBe('페이지 제목')
    expect(m.level).toBe('good')
  })

  it('제목이 누락되면 bad 로 표시한다', () => {
    const [m] = buildMetrics({ title: null, titleLength: 0 })
    expect(m.level).toBe('bad')
    expect(m.value).toBe('없음')
  })

  it('제목이 너무 길면 warn 으로 경고한다', () => {
    const [m] = buildMetrics({ title: 'x'.repeat(100), titleLength: 100 })
    expect(m.level).toBe('warn')
    expect(m.hint).toBe('길이 조정 권장')
  })

  it('메타 설명의 경계 값을 정확히 분류한다', () => {
    expect(
      buildMetrics({ metaDescription: 'x'.repeat(50), metaDescriptionLength: 50 })[0].level
    ).toBe('good')
    expect(
      buildMetrics({ metaDescription: 'x'.repeat(160), metaDescriptionLength: 160 })[0].level
    ).toBe('good')
    expect(
      buildMetrics({ metaDescription: 'x'.repeat(161), metaDescriptionLength: 161 })[0].level
    ).toBe('warn')
    expect(
      buildMetrics({ metaDescription: 'x'.repeat(10), metaDescriptionLength: 10 })[0].level
    ).toBe('warn')
  })

  it('H1 개수 1개면 good, 0개는 bad, 2개 이상은 warn', () => {
    expect(buildMetrics({ h1: ['메인 제목'] })[0].level).toBe('good')
    expect(buildMetrics({ h1: [] })[0].level).toBe('bad')
    expect(buildMetrics({ h1: ['A', 'B', 'C'] })[0].level).toBe('warn')
  })

  it('이미지 ALT 누락 개수에 따라 good/warn/bad 로 분류한다', () => {
    expect(buildMetrics({ imgTotal: 10, imgWithoutAlt: 0 })[0].level).toBe('good')
    expect(buildMetrics({ imgTotal: 10, imgWithoutAlt: 2 })[0].level).toBe('warn')
    expect(buildMetrics({ imgTotal: 10, imgWithoutAlt: 8 })[0].level).toBe('bad')
  })

  it('HTTPS 적용 여부를 good/bad 로 구분한다', () => {
    expect(buildMetrics({ isHttps: true })[0].level).toBe('good')
    expect(buildMetrics({ isHttps: false })[0].level).toBe('bad')
  })

  it('응답 속도 구간별 레벨을 반환한다', () => {
    expect(buildMetrics({ loadTimeMs: 500 })[0].level).toBe('good')
    expect(buildMetrics({ loadTimeMs: 1500 })[0].level).toBe('warn')
    expect(buildMetrics({ loadTimeMs: 3000 })[0].level).toBe('bad')
  })

  it('응답 속도가 1초 이상이면 초 단위로 포맷한다', () => {
    const [m] = buildMetrics({ loadTimeMs: 2500 })
    expect(m.value).toBe('2.5초')
  })

  it('응답 속도가 1초 미만이면 ms 단위로 표시한다', () => {
    const [m] = buildMetrics({ loadTimeMs: 420 })
    expect(m.value).toBe('420ms')
  })

  it('본문 분량 300자 이상은 good, 미만은 warn', () => {
    expect(buildMetrics({ wordCount: 500 })[0].level).toBe('good')
    expect(buildMetrics({ wordCount: 100 })[0].level).toBe('warn')
  })

  it('본문 분량에 thousand separator 를 적용한다', () => {
    const [m] = buildMetrics({ wordCount: 12345 })
    expect(m.value).toBe('12,345자')
  })

  it('구조화 데이터 있으면 타입을 최대 2개까지 나열한다', () => {
    const [m] = buildMetrics({
      hasStructuredData: true,
      structuredDataTypes: ['Article', 'Organization', 'WebSite'],
    })
    expect(m.value).toBe('Article, Organization')
    expect(m.level).toBe('good')
  })

  it('구조화 데이터 없으면 warn 으로 안내한다', () => {
    const [m] = buildMetrics({ hasStructuredData: false })
    expect(m.level).toBe('warn')
    expect(m.value).toBe('없음')
  })

  it('완전한 parsed 데이터에 대해 여러 지표를 순서대로 반환한다', () => {
    const metrics = buildMetrics({
      title: '테스트 제목',
      titleLength: 6,
      metaDescription: null,
      metaDescriptionLength: 0,
      h1: ['하나'],
      imgTotal: 5,
      imgWithoutAlt: 0,
      isHttps: true,
      hasViewport: true,
      loadTimeMs: 650,
      hasStructuredData: true,
      wordCount: 1200,
    })

    const labels = metrics.map(m => m.label)
    expect(labels).toEqual([
      '페이지 제목',
      '메타 설명',
      'H1 태그',
      '이미지 ALT',
      'HTTPS',
      '모바일 최적화',
      '응답 속도',
      '구조화 데이터',
      '본문 분량',
    ])
  })
})

describe('isVisibleReport', () => {
  const payload = { score: 80, analysisHtml: '<h1>결과</h1>', parsedData: {} }

  it('processing/sending_report/completed 이고 analysisHtml 이 있으면 true', () => {
    expect(isVisibleReport('processing', payload)).toBe(true)
    expect(isVisibleReport('sending_report', payload)).toBe(true)
    expect(isVisibleReport('completed', payload)).toBe(true)
  })

  it('status 가 분석 중이면 false', () => {
    expect(isVisibleReport('pending_analysis', payload)).toBe(false)
    expect(isVisibleReport('analyzing', payload)).toBe(false)
  })

  it('failed 상태는 false', () => {
    expect(isVisibleReport('failed', payload)).toBe(false)
  })

  it('재시도 메타만 있는 payload 는 false', () => {
    expect(isVisibleReport('processing', { _retryCount: 1, _lastError: 'x' })).toBe(false)
  })

  it('payload 가 null/undefined/원시값이면 false', () => {
    expect(isVisibleReport('completed', null)).toBe(false)
    expect(isVisibleReport('completed', undefined)).toBe(false)
    expect(isVisibleReport('completed', 'string')).toBe(false)
    expect(isVisibleReport('completed', 42)).toBe(false)
  })
})

describe('formatMetricValue', () => {
  it('number 포맷은 천 단위 구분자를 붙인다', () => {
    expect(formatMetricValue(1234567, 'number')).toBe('1,234,567')
    expect(formatMetricValue(0, 'number')).toBe('0')
  })

  it('score 포맷은 반올림된 정수로 표기한다', () => {
    expect(formatMetricValue(42.7, 'score')).toBe('43')
    expect(formatMetricValue(15, 'score')).toBe('15')
  })

  it('text 포맷은 공백·null 을 "-" 로 반환한다', () => {
    expect(formatMetricValue('SomeText', 'text')).toBe('SomeText')
    expect(formatMetricValue('   ', 'text')).toBe('-')
    expect(formatMetricValue(null, 'text')).toBe('-')
  })

  it('null/undefined/NaN 은 "-" 를 반환한다', () => {
    expect(formatMetricValue(null)).toBe('-')
    expect(formatMetricValue(undefined)).toBe('-')
    expect(formatMetricValue(Number.NaN)).toBe('-')
    expect(formatMetricValue(Number.POSITIVE_INFINITY)).toBe('-')
  })

  it('suffix 를 붙여준다', () => {
    expect(formatMetricValue(5, 'score', '년')).toBe('5년')
    expect(formatMetricValue(1200, 'number', '개')).toBe('1,200개')
    expect(formatMetricValue(null, 'score', '년')).toBe('-')
  })
})

describe('buildKpiCards', () => {
  it('null/undefined 입력에 대해 빈 배열을 반환한다', () => {
    expect(buildKpiCards(null)).toEqual([])
    expect(buildKpiCards(undefined)).toEqual([])
    expect(buildKpiCards({})).toEqual([])
  })

  it('각 핵심 지표에 대해 카드를 생성한다', () => {
    const cards = buildKpiCards({
      ahrefsDR: 55,
      mozDA: 42,
      ahrefsBacklinks: 1500,
      ahrefsRefDomains: 120,
      ahrefsTraffic: 2500,
      ahrefsOrganicKeywords: 800,
      majesticTF: 35,
      domainAgeYears: 7,
    })
    expect(cards.map(c => c.key)).toEqual([
      'ahrefsDR',
      'mozDA',
      'backlinks',
      'refDomains',
      'traffic',
      'organicKeywords',
      'majesticTF',
      'domainAge',
    ])
    expect(cards.every(c => c.level === 'good')).toBe(true)
  })

  it('Ahrefs 값이 없으면 VebAPI fallback 을 사용한다', () => {
    const cards = buildKpiCards({ backlinkTotal: 500, referringDomains: 50 })
    const labels = cards.map(c => c.key)
    expect(labels).toContain('backlinks')
    expect(labels).toContain('refDomains')
    expect(cards.find(c => c.key === 'backlinks')?.raw).toBe(500)
    expect(cards.find(c => c.key === 'refDomains')?.raw).toBe(50)
  })

  it('임계값 경계에서 good/warn/bad 레벨을 분류한다', () => {
    const good = buildKpiCards({ ahrefsDR: 40 })[0]
    const warn = buildKpiCards({ ahrefsDR: 25 })[0]
    const bad = buildKpiCards({ ahrefsDR: 5 })[0]
    expect(good.level).toBe('good')
    expect(warn.level).toBe('warn')
    expect(bad.level).toBe('bad')
  })

  it('domainAge 카드에 "년" 접미사를 붙인다', () => {
    const [card] = buildKpiCards({ domainAgeYears: 10 })
    expect(card.value).toBe('10년')
  })

  it('NaN·비숫자 값은 카드에서 제외한다', () => {
    const cards = buildKpiCards({
      ahrefsDR: Number.NaN,
      mozDA: 30,
      ahrefsBacklinks: undefined,
    })
    expect(cards.map(c => c.key)).toEqual(['mozDA'])
  })

  it('average 미전달 시 vsAverage 는 null', () => {
    const [card] = buildKpiCards({ ahrefsDR: 30 })
    expect(card.vsAverage).toBeNull()
  })

  it('average 전달 시 vsAverage 를 % 로 계산한다', () => {
    const cards = buildKpiCards(
      { ahrefsDR: 30, mozDA: 10, ahrefsBacklinks: 500 },
      { ahrefsDR: 60, mozDA: 20, ahrefsBacklinks: 200 }
    )
    expect(cards.find(c => c.key === 'ahrefsDR')?.vsAverage).toBe(50)
    expect(cards.find(c => c.key === 'mozDA')?.vsAverage).toBe(50)
    expect(cards.find(c => c.key === 'backlinks')?.vsAverage).toBe(250)
  })

  it('평균이 0 이면 vsAverage 는 null', () => {
    const [card] = buildKpiCards({ ahrefsDR: 30 }, { ahrefsDR: 0 })
    expect(card.vsAverage).toBeNull()
  })
})

describe('calculateCompetitorAverage', () => {
  it('빈 배열·null·undefined 는 null 반환', () => {
    expect(calculateCompetitorAverage(null)).toBeNull()
    expect(calculateCompetitorAverage(undefined)).toBeNull()
    expect(calculateCompetitorAverage([])).toBeNull()
  })

  it('필드별로 유효 값만 평균 집계한다', () => {
    const avg = calculateCompetitorAverage([
      { mozDA: 40, ahrefsBacklinks: 100 },
      { mozDA: 60, ahrefsBacklinks: 300 },
      { mozDA: 80, ahrefsBacklinks: 500 },
    ])!
    expect(avg.mozDA).toBe(60)
    expect(avg.ahrefsBacklinks).toBe(300)
  })

  it('결측 값은 평균에서 제외한다', () => {
    const avg = calculateCompetitorAverage([
      { mozDA: 50 },
      { ahrefsBacklinks: 100 },
      { mozDA: 100, ahrefsBacklinks: 300 },
    ])!
    expect(avg.mozDA).toBe(75) // (50+100)/2
    expect(avg.ahrefsBacklinks).toBe(200) // (100+300)/2
  })

  it('모든 수치 필드가 비어있으면 null', () => {
    expect(calculateCompetitorAverage([{ domain: 'a.com' }, { domain: 'b.com' }])).toBeNull()
  })

  it('NaN·Infinity 는 무시한다', () => {
    const avg = calculateCompetitorAverage([
      { mozDA: Number.NaN },
      { mozDA: Number.POSITIVE_INFINITY },
      { mozDA: 40 },
    ])!
    expect(avg.mozDA).toBe(40)
  })

  it('반올림으로 정수 평균 생성', () => {
    const avg = calculateCompetitorAverage([{ mozDA: 10 }, { mozDA: 11 }])!
    // (10+11)/2 = 10.5 → 반올림 11
    expect(avg.mozDA).toBe(11)
  })
})

describe('calculateCompetitorGap', () => {
  const me = {
    mozDA: 20,
    ahrefsDR: 15,
    ahrefsBacklinks: 100,
    ahrefsRefDomains: 20,
    ahrefsTraffic: 500,
  }
  const competitors = [
    {
      mozDA: 60,
      ahrefsDR: 70,
      ahrefsBacklinks: 20000,
      ahrefsRefDomains: 800,
      ahrefsTraffic: 30000,
    },
    {
      mozDA: 50,
      ahrefsDR: 60,
      ahrefsBacklinks: 10000,
      ahrefsRefDomains: 500,
      ahrefsTraffic: 20000,
    },
    { mozDA: 40, ahrefsDR: 50, ahrefsBacklinks: 5000, ahrefsRefDomains: 300, ahrefsTraffic: 10000 },
    { mozDA: 30, ahrefsDR: 40, ahrefsBacklinks: 3000, ahrefsRefDomains: 200, ahrefsTraffic: 5000 },
    { mozDA: 20, ahrefsDR: 30, ahrefsBacklinks: 2000, ahrefsRefDomains: 100, ahrefsTraffic: 2000 },
  ]

  it('me 또는 competitors 가 비어있으면 빈 배열', () => {
    expect(calculateCompetitorGap(null, competitors)).toEqual([])
    expect(calculateCompetitorGap(me, null)).toEqual([])
    expect(calculateCompetitorGap(me, [])).toEqual([])
  })

  it('평균 대비 격차·비율을 계산한다', () => {
    // avg mozDA = (60+50+40+30+20)/5 = 40
    const gaps = calculateCompetitorGap(me, competitors)
    const da = gaps.find(g => g.key === 'mozDA')!
    expect(da.avgValue).toBe(40)
    expect(da.myValue).toBe(20)
    expect(da.gap).toBe(20)
    expect(da.isBehind).toBe(true)
    expect(da.percentOfAvg).toBe(50) // 20/40 * 100
  })

  it('백링크 평균 대비 격차', () => {
    // avg ahrefsBacklinks = (20000+10000+5000+3000+2000)/5 = 8000
    const gaps = calculateCompetitorGap(me, competitors)
    const bl = gaps.find(g => g.key === 'backlinks')!
    expect(bl.avgValue).toBe(8000)
    expect(bl.gap).toBe(7900)
    expect(bl.percentOfAvg).toBe(1) // 100/8000 ≈ 1
  })

  it('앞서는 항목은 isBehind false, gap 은 음수', () => {
    const aheadMe = { mozDA: 70 }
    const [g] = calculateCompetitorGap(aheadMe, [{ mozDA: 50 }, { mozDA: 40 }])
    // avg = 45, gap = 45 - 70 = -25
    expect(g.gap).toBe(-25)
    expect(g.isBehind).toBe(false)
  })

  it('percentOfAvg 는 100 을 넘을 수 있다 (평균보다 앞선 경우)', () => {
    const [g] = calculateCompetitorGap({ mozDA: 80 }, [{ mozDA: 50 }, { mozDA: 30 }])
    // avg = 40, 80/40 * 100 = 200
    expect(g.percentOfAvg).toBe(200)
  })

  it('평균이 0 이면 percentOfAvg 는 null', () => {
    const [g] = calculateCompetitorGap({ mozDA: 10 }, [{ mozDA: 0 }, { mozDA: 0 }])
    expect(g.percentOfAvg).toBeNull()
  })

  it('한쪽만 값이 있으면 해당 지표 생략', () => {
    const gaps = calculateCompetitorGap({ mozDA: 10 }, [{ ahrefsDR: 50 }])
    expect(gaps).toEqual([])
  })

  it('VebAPI fallback 도 평균화한다', () => {
    const gaps = calculateCompetitorGap({ backlinkTotal: 50, referringDomains: 5 }, [
      { backlinkTotal: 500, referringDomains: 100 },
      { backlinkTotal: 1000, referringDomains: 200 },
    ])
    const bl = gaps.find(g => g.key === 'backlinks')!
    expect(bl.avgValue).toBe(750)
    expect(gaps.map(g => g.key).sort()).toEqual(['backlinks', 'refDomains'])
  })
})

describe('detectPlatform', () => {
  it('일반 도메인은 platform=false', () => {
    expect(detectPlatform('example.com').isPlatform).toBe(false)
    expect(detectPlatform('domainchecker.co.kr').isPlatform).toBe(false)
    expect(detectPlatform('joyful-classic-cosmos.com').isPlatform).toBe(false)
  })

  it('티스토리 하위 도메인을 식별한다', () => {
    const r = detectPlatform('luv-n-interest.tistory.com')
    expect(r.isPlatform).toBe(true)
    expect(r.platformHost).toBe('tistory.com')
    expect(r.label).toBe('티스토리 블로그')
  })

  it('위키피디아 하위 도메인을 식별한다', () => {
    const r = detectPlatform('ko.wikipedia.org')
    expect(r.isPlatform).toBe(true)
    expect(r.label).toBe('위키피디아')
  })

  it('velog 본체 도메인도 platform=true', () => {
    expect(detectPlatform('velog.io').isPlatform).toBe(true)
  })

  it('고대디·셈러쉬 본체도 plat폼으로 분류', () => {
    expect(detectPlatform('godaddy.com').isPlatform).toBe(true)
    expect(detectPlatform('semrush.com').isPlatform).toBe(true)
  })

  it('대소문자·www 접두사를 정규화한다', () => {
    expect(detectPlatform('WWW.Tistory.com').isPlatform).toBe(true)
    expect(detectPlatform('  X.Tistory.COM  ').isPlatform).toBe(true)
  })

  it('빈 입력 / null / undefined 는 false', () => {
    expect(detectPlatform('').isPlatform).toBe(false)
    expect(detectPlatform(null).isPlatform).toBe(false)
    expect(detectPlatform(undefined).isPlatform).toBe(false)
  })

  it('호스트의 부분 문자열이 우연히 일치해도 매칭하지 않는다', () => {
    // 'mytistory.com' 은 '.tistory.com' 으로 끝나지 않음
    expect(detectPlatform('mytistory.com').isPlatform).toBe(false)
    expect(detectPlatform('faketistory.com').isPlatform).toBe(false)
  })
})

describe('partitionCompetitors', () => {
  it('플랫폼과 일반 도메인을 분리한다', () => {
    const { regular, platforms } = partitionCompetitors([
      { domain: 'foo.tistory.com' },
      { domain: 'normal-site.co.kr' },
      { domain: 'ko.wikipedia.org' },
      { domain: 'another-blog.com' },
    ])
    expect(regular.map(c => c.domain)).toEqual(['normal-site.co.kr', 'another-blog.com'])
    expect(platforms.map(c => c.domain)).toEqual(['foo.tistory.com', 'ko.wikipedia.org'])
  })

  it('빈 입력은 빈 배열들', () => {
    expect(partitionCompetitors(null)).toEqual({ regular: [], platforms: [] })
    expect(partitionCompetitors([])).toEqual({ regular: [], platforms: [] })
  })
})

describe('calculateCompetitorAverage 의 플랫폼 제외', () => {
  it('플랫폼 도메인은 평균에서 제외', () => {
    const avg = calculateCompetitorAverage([
      { domain: 'normal1.com', mozDA: 20 },
      { domain: 'foo.tistory.com', mozDA: 100 }, // 평균 왜곡 시도
      { domain: 'normal2.com', mozDA: 30 },
    ])!
    // 플랫폼 제외 → (20+30)/2 = 25
    expect(avg.mozDA).toBe(25)
  })

  it('전부 플랫폼이면 null', () => {
    expect(
      calculateCompetitorAverage([
        { domain: 'a.tistory.com', mozDA: 50 },
        { domain: 'ko.wikipedia.org', mozDA: 90 },
      ])
    ).toBeNull()
  })
})

describe('trimDomainLabel', () => {
  it('짧은 도메인은 그대로 유지', () => {
    expect(trimDomainLabel('example.com')).toBe('example.com')
  })

  it('13자 초과 도메인은 11자 + ".." 로 자른다', () => {
    expect(trimDomainLabel('verylongdomainexample.co.kr')).toBe('verylongdom..')
  })

  it('undefined 입력은 "-" 반환', () => {
    expect(trimDomainLabel(undefined)).toBe('-')
  })

  it('maxLen 옵션을 지원한다', () => {
    expect(trimDomainLabel('abcdefghij', 8)).toBe('abcdef..')
  })
})

describe('buildOnPageDetail', () => {
  it('null/undefined 입력은 빈 배열', () => {
    expect(buildOnPageDetail(null)).toEqual([])
    expect(buildOnPageDetail(undefined)).toEqual([])
  })

  it('비어있는 객체에서는 그룹이 생기지 않는다', () => {
    expect(buildOnPageDetail({})).toEqual([])
  })

  it('카테고리별 그룹화', () => {
    const groups = buildOnPageDetail({
      statusCode: 200,
      isHttps: true,
      title: 'Hello SEO World',
      titleLength: 15,
      h1: ['헤드라인'],
      h2: ['소제목1', '소제목2', '소제목3'],
      h3Count: 5,
      imgTotal: 10,
      imgWithoutAlt: 0,
      hasViewport: true,
      hasOgTitle: true,
      hasOgDescription: true,
      hasOgImage: true,
      hasStructuredData: true,
      structuredDataTypes: ['Organization'],
    })
    const titles = groups.map(g => g.title)
    expect(titles).toContain('기본 정보')
    expect(titles).toContain('메타 태그')
    expect(titles).toContain('제목 구조')
    expect(titles).toContain('이미지 & 링크')
    expect(titles).toContain('기술 SEO')
    expect(titles).toContain('소셜 & 구조화 데이터')
  })

  it('상태 코드 200 은 good, 404 는 bad', () => {
    const ok = buildOnPageDetail({ statusCode: 200 })
    const bad = buildOnPageDetail({ statusCode: 404 })
    expect(ok[0].items[0].level).toBe('good')
    expect(bad[0].items[0].level).toBe('bad')
  })

  it('Robots 가 noindex 면 bad', () => {
    const groups = buildOnPageDetail({ hasRobotsMeta: 'noindex, nofollow' })
    const meta = groups.find(g => g.title === '메타 태그')!
    expect(meta.items[0].level).toBe('bad')
  })

  it('OG 일부 누락 시 warn', () => {
    const groups = buildOnPageDetail({
      hasOgTitle: true,
      hasOgDescription: true,
      hasOgImage: false,
    })
    const social = groups.find(g => g.title === '소셜 & 구조화 데이터')!
    const og = social.items.find(i => i.label === 'Open Graph')!
    expect(og.level).toBe('warn')
    expect(og.value).toContain('title')
    expect(og.value).toContain('desc')
    expect(og.value).not.toContain('image')
  })

  it('인라인 JS 가 큰 경우 bad', () => {
    const [g] = buildOnPageDetail({ inlineJsSize: 200 * 1024 })
    expect(g.title).toBe('기술 SEO')
    expect(g.items[0].level).toBe('bad')
  })

  it('값 없는 항목은 생략', () => {
    const groups = buildOnPageDetail({ statusCode: 200 })
    expect(groups.length).toBe(1)
    expect(groups[0].items.length).toBe(1)
  })
})

describe('summarizeOnPage', () => {
  it('레벨별로 카운트한다', () => {
    const summary = summarizeOnPage([
      {
        title: 'X',
        items: [
          { label: 'a', value: '', level: 'good' },
          { label: 'b', value: '', level: 'good' },
          { label: 'c', value: '', level: 'warn' },
          { label: 'd', value: '', level: 'bad' },
          { label: 'e', value: '', level: 'neutral' },
        ],
      },
    ])
    expect(summary).toEqual({ total: 5, good: 2, warn: 1, bad: 1 })
  })

  it('빈 입력은 0', () => {
    expect(summarizeOnPage([])).toEqual({ total: 0, good: 0, warn: 0, bad: 0 })
  })
})
