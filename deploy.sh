#!/bin/bash
# Bash 部署脚本
# 用于快速部署到 Vercel

echo "========================================"
echo "  得希表型采集系统 - Vercel 部署脚本  "
echo "========================================"
echo ""

# 检查是否安装了 Vercel CLI
echo "检查 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI 未安装"
    echo ""
    echo "请先安装 Vercel CLI:"
    echo "  npm install -g vercel"
    echo ""
    exit 1
fi

echo "✅ Vercel CLI 已安装"
echo ""

# 检查必要文件
echo "检查必要文件..."
required_files=(
    "index.html"
    "welcome.html"
    "calendar.html"
    "collection.html"
    "statistics.html"
    "trends.html"
    "common.css"
    "common.js"
    "vercel.json"
)

all_files_exist=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (缺失)"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo ""
    echo "❌ 缺少必要文件，无法部署"
    exit 1
fi

echo ""
echo "✅ 所有必要文件都存在"
echo ""

# 询问部署类型
echo "选择部署类型:"
echo "  1. 开发环境 (预览部署)"
echo "  2. 生产环境 (正式部署)"
echo ""

read -p "请输入选项 (1 或 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "开始部署到开发环境..."
    echo ""
    vercel
elif [ "$choice" = "2" ]; then
    echo ""
    echo "开始部署到生产环境..."
    echo ""
    vercel --prod
else
    echo ""
    echo "❌ 无效的选项"
    exit 1
fi

echo ""
echo "========================================"
echo "  部署完成！"
echo "========================================"
echo ""
echo "下一步:"
echo "  1. 访问部署的网站"
echo "  2. 在 Supabase 中配置允许的 URL"
echo "  3. 邀请用户并测试功能"
echo ""

