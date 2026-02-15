# GitHub Pages 部署指南

## 🚀 部署到 GitHub Pages

### 1. 构建生产版本
```bash
npm run build
```

这会在 `dist/` 目录生成静态文件。

### 2. GitHub Pages 设置

#### 方法 A：使用 GitHub Actions（推荐）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

#### 方法 B：手动部署

```bash
# 1. 构建
npm run build

# 2. 进入 dist 目录
cd dist

# 3. 初始化 Git（如果还没有）
git init
git add -A
git commit -m 'deploy'

# 4. 推送到 gh-pages 分支
git push -f git@github.com:YOUR_USERNAME/YOUR_REPO.git main:gh-pages

# 5. 返回项目根目录
cd -
```

### 3. Supabase 配置

假设您的 GitHub Pages 地址是：
```
https://YOUR_USERNAME.github.io/deci_data_collection/
```

在 **Supabase Dashboard** 中配置：

**Site URL**:
```
https://YOUR_USERNAME.github.io/deci_data_collection
```

**Redirect URLs** (添加以下两个):
```
https://YOUR_USERNAME.github.io/deci_data_collection/reset-password.html
https://YOUR_USERNAME.github.io/deci_data_collection/index.html
```

### 4. Vite 配置（重要！）

如果您的仓库名不是根路径，需要更新 `vite.config.js`：

创建 `vite.config.js`：

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/deci_data_collection/', // 替换为你的仓库名
  build: {
    outDir: 'dist'
  }
})
```

### 5. 完整部署流程

```bash
# 1. 确保代码已提交
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. 构建
npm run build

# 3. GitHub Actions 会自动部署（方法A）
# 或者手动推送到 gh-pages 分支（方法B）
```

### 6. GitHub 仓库设置

1. 进入 GitHub 仓库
2. **Settings** → **Pages**
3. **Source**: 选择 `gh-pages` 分支（如果使用方法B）
   或 **GitHub Actions**（如果使用方法A）
4. 等待几分钟，访问显示的 URL

### 7. 访问地址

部署完成后，访问：
```
https://YOUR_USERNAME.github.io/deci_data_collection/
```

## 📝 注意事项

1. **首次部署**：可能需要 5-10 分钟才能生效
2. **HTTPS 强制**：GitHub Pages 自动启用 HTTPS
3. **自定义域名**（可选）：
   - 在 GitHub Pages 设置中添加自定义域名
   - 更新 Supabase 的 Site URL 为自定义域名

## 🔐 环境变量

由于是静态部署，Supabase 的 URL 和 Key 会暴露在客户端代码中。
这是正常的，因为使用的是 `anon` key（公开密钥）。
真正的安全由 **Row Level Security (RLS)** 保护。

## ⚡ 快速部署脚本

创建 `deploy.sh`：

```bash
#!/bin/bash
echo "🚀 Building for production..."
npm run build

echo "📦 Deploying to GitHub Pages..."
cd dist
git init
git add -A
git commit -m "Deploy $(date)"
git push -f git@github.com:YOUR_USERNAME/deci_data_collection.git main:gh-pages
cd -

echo "✅ Deployment complete!"
echo "🌐 Visit: https://YOUR_USERNAME.github.io/deci_data_collection/"
```

使用：
```bash
chmod +x deploy.sh
./deploy.sh
```
