# PowerShell 部署脚本
# 用于快速部署到 Vercel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  得希表型采集系统 - Vercel 部署脚本  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否安装了 Vercel CLI
Write-Host "检查 Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI 未安装" -ForegroundColor Red
    Write-Host ""
    Write-Host "请先安装 Vercel CLI:" -ForegroundColor Yellow
    Write-Host "  npm install -g vercel" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Vercel CLI 已安装" -ForegroundColor Green
Write-Host ""

# 检查必要文件
Write-Host "检查必要文件..." -ForegroundColor Yellow
$requiredFiles = @(
    "index.html",
    "welcome.html",
    "calendar.html",
    "collection.html",
    "statistics.html",
    "trends.html",
    "common.css",
    "common.js",
    "vercel.json"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (缺失)" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ 缺少必要文件，无法部署" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ 所有必要文件都存在" -ForegroundColor Green
Write-Host ""

# 询问部署类型
Write-Host "选择部署类型:" -ForegroundColor Yellow
Write-Host "  1. 开发环境 (预览部署)" -ForegroundColor White
Write-Host "  2. 生产环境 (正式部署)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "请输入选项 (1 或 2)"

if ($choice -eq "1") {
    Write-Host ""
    Write-Host "开始部署到开发环境..." -ForegroundColor Cyan
    Write-Host ""
    vercel
} elseif ($choice -eq "2") {
    Write-Host ""
    Write-Host "开始部署到生产环境..." -ForegroundColor Cyan
    Write-Host ""
    vercel --prod
} else {
    Write-Host ""
    Write-Host "❌ 无效的选项" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "  1. 访问部署的网站" -ForegroundColor White
Write-Host "  2. 在 Supabase 中配置允许的 URL" -ForegroundColor White
Write-Host "  3. 邀请用户并测试功能" -ForegroundColor White
Write-Host ""

