import { TelegramCTABlock } from '@/components/marketing/TelegramCTABlock'

/**
 * 아티클 본문 하단 CTA. 글의 문맥에 맞는 문구를 넘긴다.
 */
export function ArticleCTA({
  source,
  title = '지금 사이트에 무엇이 필요한지 같이 봐드릴까요?',
  body = '사이트 주소와 목표 키워드만 알려주시면, 이 글의 기준으로 현재 상태를 확인해 드립니다.',
  label,
}: {
  source: string
  title?: string
  body?: string
  label?: string
}) {
  return (
    <TelegramCTABlock source={source} position="article" title={title} body={body} label={label} />
  )
}
