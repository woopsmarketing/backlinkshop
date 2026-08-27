/**
 * FAQ Source of Truth
 *
 * 규칙
 * - 이 파일의 answer 텍스트가 화면과 FAQPage 구조화 데이터에 동일하게 들어간다.
 *   (구조화 데이터와 화면 콘텐츠가 일치해야 한다는 요구사항)
 * - 확인할 수 없는 통계·성과 수치, 결과 보증성 표현, 경쟁사 일반에 대한 부정적 주장을 쓰지 않는다.
 * - 답변에서 이어서 볼 페이지는 links 로 분리해 내부링크를 만든다.
 */

export type FaqCategory =
  | '백링크 기본'
  | 'PBN'
  | '작업 과정'
  | '가격'
  | '결과 · 기간'
  | '환불 · 정책'

export type FaqItem = {
  id: string
  category: FaqCategory
  question: string
  answer: string
  links?: { href: string; label: string }[]
  /** 홈 FAQ 프리뷰에 노출할 항목 */
  preview?: boolean
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  '백링크 기본',
  'PBN',
  '작업 과정',
  '가격',
  '결과 · 기간',
  '환불 · 정책',
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is-backlink',
    category: '백링크 기본',
    question: '백링크를 하면 순위가 오르나요?',
    answer:
      '백링크는 검색순위에 영향을 주는 요소 중 하나이지만, 그것만으로 순위가 결정되지는 않습니다. 같은 링크를 받아도 페이지가 검색의도에 맞는 답을 담고 있는지, 색인과 구조에 문제가 없는지, 해당 키워드의 경쟁이 얼마나 강한지에 따라 결과가 달라집니다. 그래서 링크를 추가하기 전에 지금 사이트에서 무엇이 부족한지부터 확인하는 편이 낫습니다.',
    links: [
      { href: '/backlink', label: '백링크가 무엇인지부터 보기' },
      { href: '/google-ranking', label: '순위가 오르지 않는 이유' },
    ],
    preview: true,
  },
  {
    id: 'which-service',
    category: '백링크 기본',
    question: '어떤 서비스를 선택해야 하나요?',
    answer:
      '지금 막혀 있는 지점에 따라 다릅니다. 경쟁이 심한 키워드에서 신호가 더 필요하면 PBN 백링크를, 무엇부터 해야 할지 모르겠다면 조합을 먼저 설계하는 플랜 백링크를 봅니다. 링크를 늘렸는데도 변화가 없다면 온페이지 SEO를, 글은 있는데 노출이 없다면 콘텐츠 SEO를 먼저 봅니다. 상황을 알려주시면 어느 쪽이 맞는지 같이 판단해 드립니다.',
    links: [{ href: '/services', label: '서비스 비교해서 고르기' }],
    preview: true,
  },
  {
    id: 'existing-backlinks',
    category: '백링크 기본',
    question: '이미 다른 곳에서 백링크를 받았는데 추가로 진행해도 되나요?',
    answer:
      '가능합니다. 다만 기존 링크 프로필을 먼저 보는 것이 중요합니다. 이미 특정 유형이나 특정 앵커 텍스트에 치우쳐 있다면, 같은 방향으로 더 쌓는 것이 도움이 되지 않을 수 있습니다. 현재 어떤 링크가 있는지 확인한 뒤 부족한 쪽을 채우는 방식으로 구성합니다.',
    links: [{ href: '/backlink', label: '좋은 백링크 판단 기준' }],
  },
  {
    id: 'pbn-what',
    category: 'PBN',
    question: 'PBN은 어떤 서비스인가요?',
    answer:
      'PBN(Private Blog Network)은 직접 운영하는 사이트들에서 목표 사이트로 링크를 연결하는 방식입니다. 링크가 생기는 위치를 직접 통제할 수 있어 신호가 빠르게 전달되는 대신, 구성 방식에 따라 품질 편차가 큽니다. 백링크샵은 자체 운영 도메인에서 작업하며, 작업이 끝나면 어떤 URL에 어떤 앵커로 링크가 생성되었는지 확인할 수 있도록 내역을 제공합니다.',
    links: [{ href: '/services/pbn-backlink', label: 'PBN이 어떻게 구성되는지 보기' }],
    preview: true,
  },
  {
    id: 'pbn-risk',
    category: 'PBN',
    question: 'PBN은 위험하지 않나요?',
    answer:
      'PBN은 구글이 권장하는 방식은 아니며, 위험이 0이라고 말할 수 있는 링크 작업은 없습니다. 실제로 문제가 되는 것은 같은 IP·같은 호스팅에 몰려 있고 콘텐츠가 자동 생성된 저품질 네트워크입니다. 저희는 호스팅과 IP를 분산하고 사이트마다 고유한 콘텐츠를 유지하는 방식으로 운영합니다. 그리고 모든 사이트에 PBN을 권하지 않습니다. 사이트 상태와 목표에 따라 맞지 않는다고 판단되면 그렇게 말씀드립니다.',
    links: [
      { href: '/services/pbn-backlink', label: 'PBN이 맞는 경우와 아닌 경우' },
      { href: '/blog/what-is-pbn-backlink', label: 'PBN 구조와 확인할 점' },
    ],
    preview: true,
  },
  {
    id: 'process',
    category: '작업 과정',
    question: '작업은 어떤 순서로 진행되나요?',
    answer:
      '사이트 주소와 목표 키워드를 확인하는 것에서 시작합니다. 현재 검색 노출 상태와 기존 링크 프로필, 온페이지 구성을 보고 무엇이 부족한지 판단한 뒤, 필요한 작업만 구성해 안내드립니다. 범위에 합의하면 작업을 진행하고, 완료 후 작업 내역과 이후 방향을 함께 공유합니다.',
    links: [{ href: '/services', label: '진행 프로세스 보기' }],
  },
  {
    id: 'report',
    category: '작업 과정',
    question: '작업 결과는 어떻게 확인하나요?',
    answer:
      '작업이 완료되면 어떤 URL에 링크가 생성되었는지, 어떤 앵커 텍스트를 사용했는지가 포함된 작업 내역을 전달드립니다. 무엇을 했는지 확인할 수 없는 상태로 작업을 마치지 않는 것을 기준으로 삼고 있습니다.',
  },
  {
    id: 'price-how',
    category: '가격',
    question: '비용은 어떻게 결정되나요?',
    answer:
      '키워드 경쟁도, 목표로 하는 페이지, 도메인의 현재 상태, 필요한 링크 유형, 작업 범위에 따라 달라집니다. 같은 서비스라도 사이트마다 필요한 작업량이 다르기 때문에 시작가만 공개하고, 실제 구성은 상황을 본 뒤 안내드립니다.',
    links: [{ href: '/pricing', label: '가격과 가격이 달라지는 이유 보기' }],
    preview: true,
  },
  {
    id: 'credit',
    category: '가격',
    question: '크레딧은 원화로 얼마인가요?',
    answer: '1 크레딧은 1원입니다. 예를 들어 300,000 크레딧으로 표기된 구성은 300,000원입니다.',
    links: [{ href: '/pricing', label: '서비스별 가격표' }],
  },
  {
    id: 'timeline',
    category: '결과 · 기간',
    question: '효과는 언제부터 보이나요?',
    answer:
      '검색 결과에 반영되는 시점은 사이트 상태와 키워드 경쟁 강도에 따라 크게 달라져서, 며칠 안에 확인되는 경우도 있고 몇 달에 걸쳐 움직이는 경우도 있습니다. 특정 기간 안에 특정 순위를 보장하지는 않습니다. 대신 어떤 지표를 어느 시점에 확인하면 되는지를 작업 시작 시점에 함께 정합니다.',
  },
  {
    id: 'guarantee',
    category: '결과 · 기간',
    question: '순위 상승을 보장하나요?',
    answer:
      '보장하지 않습니다. 검색 순위는 검색엔진의 판단과 경쟁 사이트의 변화에 따라 달라지므로, 특정 순위를 약속하는 것은 사실과 다릅니다. 저희가 약속할 수 있는 것은 합의된 범위의 작업을 진행하고, 무엇을 했는지 확인 가능한 형태로 전달하는 것입니다.',
  },
  {
    id: 'refund',
    category: '환불 · 정책',
    question: '환불 기준은 어떻게 되나요?',
    answer:
      '작업이 시작되기 전에는 전액 환불됩니다. 작업이 진행된 이후에는 진행된 범위를 기준으로 환불 여부와 금액을 정합니다. 자세한 조건은 환불정책 문서에 정리해 두었습니다.',
    links: [{ href: '/refund', label: '환불정책 전문 보기' }],
    preview: true,
  },
  {
    id: 'privacy',
    category: '환불 · 정책',
    question: '상담할 때 어떤 정보를 알려줘야 하나요?',
    answer:
      '사이트 주소와 목표 키워드만 있으면 첫 판단은 가능합니다. 그 외 정보는 필요할 때만 요청드리며, 수집·이용 범위는 개인정보처리방침에 정리되어 있습니다.',
    links: [{ href: '/privacy', label: '개인정보처리방침' }],
  },
]

export function getFaqByCategory(category: FaqCategory): FaqItem[] {
  return FAQ_ITEMS.filter(item => item.category === category)
}

export function getPreviewFaq(): FaqItem[] {
  return FAQ_ITEMS.filter(item => item.preview)
}
