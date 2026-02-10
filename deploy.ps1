# 배포 스크립트 - GitHub 2곳에 동시 푸시
# 사용법: .\deploy.ps1 "커밋 메시지"

param(
    [string]$Message = "Update"
)

Write-Host "🚀 배포 시작..." -ForegroundColor Green
Write-Host ""

# 1. Git 상태 확인
Write-Host "📊 Git 상태 확인..." -ForegroundColor Yellow
git status

# 2. 변경사항 추가
Write-Host ""
Write-Host "📦 변경사항 추가..." -ForegroundColor Yellow
git add .

# 3. 커밋
Write-Host ""
Write-Host "💾 커밋 생성..." -ForegroundColor Yellow
git commit -m $Message

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  커밋할 변경사항이 없습니다." -ForegroundColor Yellow
    Write-Host ""
    
    # 강제 푸시 확인
    $response = Read-Host "그래도 푸시하시겠습니까? (y/N)"
    if ($response -ne "y") {
        Write-Host "❌ 배포 취소됨" -ForegroundColor Red
        exit 0
    }
}

# 4. 메인 레포 푸시
Write-Host ""
Write-Host "🔄 GitHub (origin) 푸시..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ origin 푸시 실패!" -ForegroundColor Red
    exit 1
}

# 5. Vercel 레포 푸시
Write-Host ""
Write-Host "🔄 GitHub (vercel-repo) 푸시..." -ForegroundColor Yellow
git push vercel-repo main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ vercel-repo 푸시 실패!" -ForegroundColor Red
    exit 1
}

# 6. 완료
Write-Host ""
Write-Host "✅ 배포 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 푸시된 레포:" -ForegroundColor Cyan
Write-Host "  - origin: https://github.com/woopsmarketing/backlinkshop" -ForegroundColor Gray
Write-Host "  - vercel-repo: https://github.com/woopsmarketing/backlinkshop-vercel" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "⏳ 배포 완료까지 약 2-3분 소요" -ForegroundColor Gray
Write-Host ""
