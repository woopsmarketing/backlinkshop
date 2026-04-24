import { describe, expect, it } from 'vitest'
import {
  buildKpiCards,
  buildMetrics,
  calculateCompetitorGap,
  formatMetricValue,
  isVisibleReport,
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
})

describe('calculateCompetitorGap', () => {
  const me = {
    mozDA: 20,
    ahrefsDR: 15,
    ahrefsBacklinks: 100,
    ahrefsRefDomains: 20,
    ahrefsTraffic: 500,
  }
  const top = {
    mozDA: 55,
    ahrefsDR: 60,
    ahrefsBacklinks: 10000,
    ahrefsRefDomains: 500,
    ahrefsTraffic: 20000,
  }

  it('me 또는 top 이 비어있으면 빈 배열', () => {
    expect(calculateCompetitorGap(null, top)).toEqual([])
    expect(calculateCompetitorGap(me, null)).toEqual([])
  })

  it('뒤처진 항목은 isBehind true, 격차·비율 계산', () => {
    const gaps = calculateCompetitorGap(me, top)
    const bl = gaps.find(g => g.key === 'backlinks')!
    expect(bl.gap).toBe(9900)
    expect(bl.isBehind).toBe(true)
    expect(bl.percentOfTop).toBe(1)
  })

  it('앞서는 항목은 isBehind false, gap 은 음수', () => {
    const aheadMe = { mozDA: 70 }
    const aheadTop = { mozDA: 50 }
    const [g] = calculateCompetitorGap(aheadMe, aheadTop)
    expect(g.gap).toBe(-20)
    expect(g.isBehind).toBe(false)
  })

  it('top 값이 0 이면 percentOfTop 은 null', () => {
    const [g] = calculateCompetitorGap({ mozDA: 10 }, { mozDA: 0 })
    expect(g.percentOfTop).toBe(null)
  })

  it('한쪽 필드가 비어있으면 해당 지표는 생략', () => {
    const gaps = calculateCompetitorGap({ mozDA: 10 }, { ahrefsDR: 50 })
    expect(gaps).toEqual([])
  })

  it('VebAPI fallback 도 인식한다', () => {
    const gaps = calculateCompetitorGap(
      { backlinkTotal: 50, referringDomains: 5 },
      { backlinkTotal: 500, referringDomains: 100 }
    )
    expect(gaps.map(g => g.key).sort()).toEqual(['backlinks', 'refDomains'])
  })

  it('percentOfTop 은 상한 100 으로 클램프된다', () => {
    const [g] = calculateCompetitorGap({ mozDA: 80 }, { mozDA: 50 })
    expect(g.percentOfTop).toBe(100)
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
