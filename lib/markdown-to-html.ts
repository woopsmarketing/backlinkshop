/**
 * 간단한 마크다운 → HTML 변환
 * SEO 분석 결과(마크다운)를 이메일용 HTML로 변환
 */

export function markdownToHtml(md: string): string {
  let html = md
    // ## 헤딩
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // **bold**
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    // `code`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // - 리스트
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // 번호 리스트
    .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // 연속 <li>를 <ul>로 감싸기
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    // 줄바꿈
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  // 전체를 <p>로 감싸기
  html = `<p>${html}</p>`
  // 빈 <p> 제거
  html = html.replace(/<p><\/p>/g, '').replace(/<p><br\/><\/p>/g, '')

  return html
}
