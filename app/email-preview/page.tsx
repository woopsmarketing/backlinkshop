/**
 * 이메일 미리보기 페이지
 * /email-preview 접속하여 실제 이메일 렌더링 확인
 */

import { AnnouncementEmail } from '@/lib/email/templates/announcement'

export default function EmailPreviewPage() {
  return (
    <div style={{ padding: '40px', background: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', color: '#111827' }}>
            📧 이메일 미리보기
          </h1>
          <p style={{ margin: '10px 0 0 0', color: '#6b7280', fontSize: '14px' }}>
            아래는 실제 고객에게 발송될 이메일 내용입니다
          </p>
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <AnnouncementEmail customerEmail="고객@example.com" />
        </div>

        <div
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', color: '#111827' }}>💡 미리보기 안내</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#6b7280', fontSize: '14px' }}>
            <li>실제 이메일과 동일한 내용이 표시됩니다</li>
            <li>버튼과 링크는 실제로 작동합니다</li>
            <li>
              테스트 발송은{' '}
              <a href="/admin/emails/test" style={{ color: '#667eea' }}>
                /admin/emails/test
              </a>{' '}
              페이지에서 가능합니다
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
