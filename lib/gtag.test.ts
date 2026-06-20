import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  trackAnalyzePageView,
  trackChatMessageSent,
  trackChatWidgetOpen,
  trackLpSubmit,
  trackSetUser,
  trackTelegramClick,
} from './gtag'

type Call = unknown[]

let calls: Call[] = []

beforeEach(() => {
  calls = []
  ;(globalThis as unknown as { window: unknown }).window = globalThis
  ;(globalThis as unknown as { gtag: (...args: unknown[]) => void }).gtag = (
    ...args: unknown[]
  ) => {
    calls.push(args)
  }
})

afterEach(() => {
  delete (globalThis as unknown as Record<string, unknown>).window
  delete (globalThis as unknown as Record<string, unknown>).gtag
})

describe('trackSetUser (Enhanced Conversions)', () => {
  it('skips when emailHash is empty', () => {
    trackSetUser('')
    expect(calls).toHaveLength(0)
  })

  it('skips when emailHash length is not 64', () => {
    trackSetUser('short')
    trackSetUser('a'.repeat(63))
    trackSetUser('a'.repeat(65))
    expect(calls).toHaveLength(0)
  })

  it('sets user_data with sha256_email_address when 64-char hash', () => {
    const hash = 'a'.repeat(64)
    trackSetUser(hash)
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual(['set', 'user_data', { sha256_email_address: hash }])
  })
})

describe('trackLpSubmit', () => {
  it('emits lp_form_submit with ref and domain', () => {
    trackLpSubmit({ ref: 'backlink', domain: 'example.com' })
    expect(calls).toHaveLength(1)
    expect(calls[0]).toEqual([
      'event',
      'lp_form_submit',
      { ref: 'backlink', domain: 'example.com' },
    ])
  })

  it('defaults missing ref to "(none)"', () => {
    trackLpSubmit({ domain: 'example.com' })
    expect(calls[0]).toEqual(['event', 'lp_form_submit', { ref: '(none)', domain: 'example.com' }])
  })

  it('defaults missing domain to empty string', () => {
    trackLpSubmit({ ref: 'rank' })
    expect(calls[0]).toEqual(['event', 'lp_form_submit', { ref: 'rank', domain: '' }])
  })
})

describe('trackTelegramClick', () => {
  it('emits telegram_click with domain and placement', () => {
    trackTelegramClick({ domain: 'example.com', placement: 'result_mid' })
    expect(calls[0]).toEqual([
      'event',
      'telegram_click',
      { domain: 'example.com', placement: 'result_mid' },
    ])
  })

  it('defaults missing domain to empty string', () => {
    trackTelegramClick({ placement: 'sticky' })
    expect(calls[0]).toEqual(['event', 'telegram_click', { domain: '', placement: 'sticky' }])
  })
})

describe('trackAnalyzePageView', () => {
  it('emits analyze_page_view with domain', () => {
    trackAnalyzePageView({ domain: 'example.com' })
    expect(calls[0]).toEqual(['event', 'analyze_page_view', { domain: 'example.com' }])
  })
})

describe('trackChatWidgetOpen', () => {
  it('emits chat_widget_open with domain', () => {
    trackChatWidgetOpen({ domain: 'example.com' })
    expect(calls[0]).toEqual(['event', 'chat_widget_open', { domain: 'example.com' }])
  })

  it('defaults missing domain to empty string', () => {
    trackChatWidgetOpen()
    expect(calls[0]).toEqual(['event', 'chat_widget_open', { domain: '' }])
  })
})

describe('trackChatMessageSent', () => {
  it('emits chat_message_sent with domain', () => {
    trackChatMessageSent({ domain: 'example.com' })
    expect(calls[0]).toEqual(['event', 'chat_message_sent', { domain: 'example.com' }])
  })

  it('defaults missing domain to empty string', () => {
    trackChatMessageSent()
    expect(calls[0]).toEqual(['event', 'chat_message_sent', { domain: '' }])
  })
})

describe('no-op when window or gtag missing', () => {
  it('all helpers do nothing when window is undefined', () => {
    delete (globalThis as unknown as Record<string, unknown>).window
    trackSetUser('a'.repeat(64))
    trackLpSubmit({ ref: 'backlink' })
    trackTelegramClick({ placement: 'x' })
    trackAnalyzePageView({ domain: 'example.com' })
    trackChatWidgetOpen({ domain: 'example.com' })
    trackChatMessageSent({ domain: 'example.com' })
    expect(calls).toHaveLength(0)
  })

  it('all helpers do nothing when window.gtag is missing', () => {
    delete (globalThis as unknown as Record<string, unknown>).gtag
    trackSetUser('a'.repeat(64))
    trackLpSubmit({ ref: 'backlink' })
    trackTelegramClick({ placement: 'x' })
    trackAnalyzePageView({ domain: 'example.com' })
    trackChatWidgetOpen({ domain: 'example.com' })
    trackChatMessageSent({ domain: 'example.com' })
    expect(calls).toHaveLength(0)
  })
})
