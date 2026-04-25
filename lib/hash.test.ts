import { describe, expect, it } from 'vitest'
import { normalizeEmail, sha256, sha256Email } from './hash'

describe('normalizeEmail', () => {
  it('trims and lowercases', () => {
    expect(normalizeEmail('  Hi@Example.COM  ')).toBe('hi@example.com')
  })

  it('returns empty for non-string inputs', () => {
    expect(normalizeEmail(null)).toBe('')
    expect(normalizeEmail(undefined)).toBe('')
    expect(normalizeEmail(123)).toBe('')
    expect(normalizeEmail({})).toBe('')
  })

  it('returns empty for empty/whitespace-only string', () => {
    expect(normalizeEmail('')).toBe('')
    expect(normalizeEmail('   ')).toBe('')
  })

  it('preserves already-normalized email', () => {
    expect(normalizeEmail('user@domain.com')).toBe('user@domain.com')
  })
})

describe('sha256', () => {
  // RFC 6234 표준 테스트 벡터
  it('hashes empty string to known digest', async () => {
    expect(await sha256('')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    )
  })

  it('hashes "abc" to known digest', async () => {
    expect(await sha256('abc')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })

  it('returns 64-char lowercase hex', async () => {
    const hash = await sha256('any-string')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[0-9a-f]{64}$/)
  })

  it('hashes UTF-8 (Korean) consistently', async () => {
    const a = await sha256('백링크샵')
    const b = await sha256('백링크샵')
    expect(a).toBe(b)
    expect(a).toHaveLength(64)
  })
})

describe('sha256Email', () => {
  it('normalizes before hashing — case/whitespace invariant', async () => {
    const a = await sha256Email('  Hi@Example.COM  ')
    const b = await sha256Email('hi@example.com')
    expect(a).toBe(b)
  })

  it('returns empty for invalid input (no hashing)', async () => {
    expect(await sha256Email('')).toBe('')
    expect(await sha256Email(null)).toBe('')
    expect(await sha256Email(undefined)).toBe('')
    expect(await sha256Email('   ')).toBe('')
  })

  it('different emails yield different hashes', async () => {
    const a = await sha256Email('a@example.com')
    const b = await sha256Email('b@example.com')
    expect(a).not.toBe(b)
  })

  it('matches known SHA-256 of normalized email', async () => {
    // sha256("test@example.com") — 외부 도구로 사전 계산한 표준 값
    expect(await sha256Email('TEST@example.com')).toBe(
      '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b'
    )
  })
})
