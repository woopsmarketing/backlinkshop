import { describe, expect, it } from 'vitest'
import { extractDomain, isValidDomain, normalizeUrl, toDomainSlug } from './domain'

describe('normalizeUrl', () => {
  it('무프로토콜 도메인에 https:// 프리픽스를 붙인다', () => {
    expect(normalizeUrl('example.com')).toBe('https://example.com')
  })

  it('http 입력도 https로 통일한다', () => {
    expect(normalizeUrl('http://example.com')).toBe('https://example.com')
  })

  it('https 입력은 그대로 유지한다', () => {
    expect(normalizeUrl('https://example.com')).toBe('https://example.com')
  })

  it('스킴-릴레이티브(//) 프로토콜을 처리한다', () => {
    expect(normalizeUrl('//example.com')).toBe('https://example.com')
  })

  it('앞뒤 공백을 제거한다', () => {
    expect(normalizeUrl('   example.com   ')).toBe('https://example.com')
  })

  it('선행 슬래시 다수를 제거한다', () => {
    expect(normalizeUrl('///example.com')).toBe('https://example.com')
  })

  it('경로·쿼리는 유지한다', () => {
    expect(normalizeUrl('https://example.com/blog/post?q=1')).toBe(
      'https://example.com/blog/post?q=1'
    )
  })

  it('한글 도메인을 유지한다', () => {
    expect(normalizeUrl('한글도메인.한국')).toBe('https://한글도메인.한국')
  })

  it('빈 문자열·공백-only 입력은 빈 문자열을 반환한다', () => {
    expect(normalizeUrl('')).toBe('')
    expect(normalizeUrl('   ')).toBe('')
  })

  it('문자열이 아닌 입력은 빈 문자열을 반환한다', () => {
    // @ts-expect-error 런타임 방어 테스트
    expect(normalizeUrl(null)).toBe('')
    // @ts-expect-error 런타임 방어 테스트
    expect(normalizeUrl(undefined)).toBe('')
    // @ts-expect-error 런타임 방어 테스트
    expect(normalizeUrl(123)).toBe('')
  })

  it('대문자 프로토콜도 제거한다', () => {
    expect(normalizeUrl('HTTPS://Example.com')).toBe('https://Example.com')
  })
})

describe('extractDomain', () => {
  it('전체 URL에서 호스트만 추출한다', () => {
    expect(extractDomain('https://example.com/path/to/page')).toBe('example.com')
  })

  it('쿼리·해시 뒤의 부분을 자른다', () => {
    expect(extractDomain('https://example.com/page?x=1#section')).toBe('example.com')
  })

  it('포트를 포함한 호스트를 반환한다', () => {
    expect(extractDomain('https://example.com:8080/path')).toBe('example.com:8080')
  })

  it('서브도메인을 유지한다', () => {
    expect(extractDomain('https://blog.example.com/post')).toBe('blog.example.com')
  })

  it('소문자로 정규화한다', () => {
    expect(extractDomain('https://Example.COM/Path')).toBe('example.com')
  })

  it('프로토콜 없는 입력도 처리한다', () => {
    expect(extractDomain('example.com/path')).toBe('example.com')
  })

  it('빈 입력은 빈 문자열을 반환한다', () => {
    expect(extractDomain('')).toBe('')
    expect(extractDomain('   ')).toBe('')
  })
})

describe('isValidDomain', () => {
  it('기본 도메인을 허용한다', () => {
    expect(isValidDomain('example.com')).toBe(true)
    expect(isValidDomain('sub.example.co.kr')).toBe(true)
  })

  it('한글 도메인을 허용한다', () => {
    expect(isValidDomain('한글도메인.한국')).toBe(true)
  })

  it('하이픈을 포함한 도메인을 허용한다', () => {
    expect(isValidDomain('my-site.example.com')).toBe(true)
  })

  it('TLD 없는 입력은 거부한다', () => {
    expect(isValidDomain('example')).toBe(false)
    expect(isValidDomain('example.')).toBe(false)
  })

  it('선행 점으로 시작하는 입력은 거부한다', () => {
    expect(isValidDomain('.example.com')).toBe(false)
  })

  it('TLD가 1글자인 입력은 거부한다', () => {
    expect(isValidDomain('example.c')).toBe(false)
  })

  it('공백 포함 입력은 거부한다', () => {
    expect(isValidDomain('example .com')).toBe(false)
    expect(isValidDomain(' example.com ')).toBe(false)
  })

  it('빈 문자열은 거부한다', () => {
    expect(isValidDomain('')).toBe(false)
  })
})

describe('toDomainSlug', () => {
  it('폼 입력 전체 파이프라인을 통과시킨다', () => {
    expect(toDomainSlug('https://Example.com/blog/post?q=1')).toBe('example.com')
  })

  it('무프로토콜 입력을 처리한다', () => {
    expect(toDomainSlug('example.com')).toBe('example.com')
  })

  it('서브도메인·한글 도메인을 보존한다', () => {
    expect(toDomainSlug('https://blog.example.co.kr/')).toBe('blog.example.co.kr')
    expect(toDomainSlug('한글도메인.한국')).toBe('한글도메인.한국')
  })

  it('유효하지 않은 도메인은 빈 문자열을 반환한다', () => {
    expect(toDomainSlug('not-a-domain')).toBe('')
    expect(toDomainSlug('')).toBe('')
    expect(toDomainSlug('   ')).toBe('')
  })
})
