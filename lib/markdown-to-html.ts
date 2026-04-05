/**
 * 간단한 마크다운 → HTML 변환
 * SEO 분석 결과(마크다운)를 이메일용 HTML로 변환
 */

export function markdownToHtml(md: string): string {
  let html = md
    // 코드 블록 제거 (```html ... ``` 등)
    .replace(/```[\s\S]*?```/g, '')
    // 인라인 코드 제거 (이메일에서 깨짐)
    .replace(/`([^`]+)`/g, '$1')
    // ## 헤딩
    .replace(
      /^### (.+)$/gm,
      '<h3 style="font-size:15px;color:#1e40af;margin:20px 0 8px 0;font-weight:700;">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="font-size:17px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:6px;margin:24px 0 10px 0;font-weight:700;">$1</h2>'
    )
    // **bold**
    .replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#111827;">$1</strong>')
    // - 리스트
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:10px;line-height:1.7;">$1</li>')
    // 번호 리스트
    .replace(/^\d+\.\s+(.+)$/gm, '<li style="margin-bottom:10px;line-height:1.7;">$1</li>')
    // 연속 <li>를 <ul>로 감싸기
    .replace(/((?:<li[^>]*>.*<\/li>\n?)+)/g, '<ul style="padding-left:18px;margin:8px 0;">$1</ul>')
    // 빈 줄 → 단락 구분
    .replace(/\n\n/g, '</p><p style="margin:8px 0;line-height:1.7;">')
    // 줄바꿈
    .replace(/\n/g, '<br/>')

  // 전체를 <p>로 감싸기
  html = `<p style="margin:8px 0;line-height:1.7;">${html}</p>`
  // 빈 <p> 제거
  html = html.replace(/<p[^>]*><\/p>/g, '').replace(/<p[^>]*><br\/><\/p>/g, '')

  return html
}
