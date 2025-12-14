# 🚀 Vercel 部署指南

## 准备工作

### 1. 确认文件准备完毕
- ✅ `vercel.json` - Vercel 配置文件
- ✅ `.vercelignore` - 忽略文件列表
- ✅ `README.md` - 项目说明文档
- ✅ 所有 HTML/CSS/JS 文件

### 2. 确认 Supabase 配置
在 `common.js` 中检查：
```javascript
const SUPABASE_URL = 'https://dompuruxntwvzqfnhufe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...'; // 您的 API Key
```

---

## 方式一：通过 Vercel CLI 部署（推荐）

### 步骤 1: 安装 Vercel CLI

```bash
# 使用 npm
npm install -g vercel

# 或使用 yarn
yarn global add vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

选择登录方式：
- GitHub
- GitLab
- Bitbucket
- Email

### 步骤 3: 部署项目

在项目根目录运行：

```bash
# 首次部署（开发环境）
vercel
```

CLI 会询问：
1. **Set up and deploy?** → Yes
2. **Which scope?** → 选择您的账户
3. **Link to existing project?** → No
4. **What's your project's name?** → `deci-phenotype-collection`（或自定义）
5. **In which directory is your code located?** → `./`（当前目录）

### 步骤 4: 生产部署

```bash
# 部署到生产环境
vercel --prod
```

部署完成后，您会看到：
```
✅ Production: https://deci-phenotype-collection.vercel.app
```

---

## 方式二：通过 Git 仓库部署

### 步骤 1: 初始化 Git 仓库

```bash
# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Deci Phenotype Collection System"
```

### 步骤 2: 推送到远程仓库

#### 使用 GitHub
```bash
# 创建 GitHub 仓库后
git remote add origin https://github.com/your-username/deci-phenotype-collection.git
git branch -M main
git push -u origin main
```

#### 使用 GitLab
```bash
git remote add origin https://gitlab.com/your-username/deci-phenotype-collection.git
git branch -M main
git push -u origin main
```

### 步骤 3: 在 Vercel 中导入项目

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 选择您的仓库：`deci-phenotype-collection`
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: 留空（静态站点）
   - **Output Directory**: 留空
6. 点击 **"Deploy"**

---

## 方式三：通过 Vercel Dashboard 上传

### 步骤 1: 准备部署文件

确保以下文件在项目根目录：
- `index.html`
- `welcome.html`
- `calendar.html`
- `collection.html`
- `statistics.html`
- `trends.html`
- `common.css`
- `common.js`
- `vercel.json`

### 步骤 2: 上传到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 点击 **"New Project"**
3. 选择 **"Upload"** 标签
4. 拖拽项目文件夹或选择文件
5. 点击 **"Deploy"**

---

## 部署后配置

### 1. 设置自定义域名（可选）

在 Vercel Dashboard 中：
1. 进入项目设置
2. 点击 **"Domains"**
3. 添加自定义域名
4. 按照提示配置 DNS

### 2. 配置环境变量（如果需要）

虽然当前项目将 Supabase 配置写在代码中，但建议使用环境变量：

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 **"Environment Variables"**
3. 添加：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

然后修改 `common.js`：
```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fallback-key';
```

### 3. 启用 HTTPS（自动）

Vercel 自动为所有部署启用 HTTPS，无需额外配置。

---

## 验证部署

### 1. 访问部署的网站

```
https://your-project-name.vercel.app
```

### 2. 检查功能

- ✅ 首页加载正常
- ✅ 登录功能正常
- ✅ 数据采集页面正常
- ✅ 统计页面正常
- ✅ 趋势分析页面正常
- ✅ 多语言切换正常

### 3. 检查控制台

打开浏览器开发者工具（F12），检查：
- ✅ 没有 JavaScript 错误
- ✅ Supabase 连接成功
- ✅ 网络请求正常

---

## 常见问题

### Q1: 部署后页面空白
**原因**: 文件路径错误或 Supabase 配置错误

**解决方案**:
1. 检查浏览器控制台错误
2. 确认 `common.js` 中的 Supabase 配置正确
3. 确认所有文件都已上传

### Q2: 登录失败
**原因**: Supabase 配置错误或 CORS 问题

**解决方案**:
1. 在 Supabase Dashboard 中检查 API Key
2. 在 Supabase 中添加 Vercel 域名到允许的 URL 列表：
   - 进入 Authentication > URL Configuration
   - 添加 `https://your-project.vercel.app` 到 Site URL
   - 添加 `https://your-project.vercel.app/**` 到 Redirect URLs

### Q3: 数据无法保存
**原因**: RLS 策略未正确配置

**解决方案**:
1. 确认已运行 `supabase_schema.sql`
2. 检查 Supabase Table Editor 中的 RLS 策略
3. 确认用户已正确登录

### Q4: 图表不显示
**原因**: Chart.js CDN 加载失败

**解决方案**:
1. 检查网络连接
2. 确认 CDN 链接正确
3. 尝试使用其他 CDN 源

---

## 更新部署

### 使用 Vercel CLI

```bash
# 更新代码后
git add .
git commit -m "Update: description"

# 重新部署
vercel --prod
```

### 使用 Git 集成

```bash
# 推送到 Git 仓库
git push origin main

# Vercel 会自动检测并重新部署
```

---

## 性能优化

### 1. 启用 Vercel Analytics（可选）

在 Vercel Dashboard 中：
1. 进入项目设置
2. 点击 **"Analytics"**
3. 启用 Analytics

### 2. 配置缓存

`vercel.json` 已配置基本缓存策略：
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### 3. 压缩资源

Vercel 自动压缩 HTML/CSS/JS 文件，无需额外配置。

---

## 监控和日志

### 查看部署日志

在 Vercel Dashboard 中：
1. 进入项目
2. 点击 **"Deployments"**
3. 选择部署记录
4. 查看 **"Build Logs"** 和 **"Function Logs"**

### 实时监控

使用 Vercel Analytics 监控：
- 页面访问量
- 响应时间
- 错误率
- 地理分布

---

## 安全建议

### 1. 保护 API Key

❌ **不要**将敏感信息提交到公开仓库

✅ **使用**环境变量存储敏感信息

### 2. 配置 CORS

在 Supabase Dashboard 中：
1. 进入 Authentication > URL Configuration
2. 只添加您的 Vercel 域名

### 3. 启用 RLS

确保所有表都启用了 Row Level Security：
```sql
ALTER TABLE phenotype_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_statistics ENABLE ROW LEVEL SECURITY;
```

---

## 备份策略

### 1. 代码备份

- ✅ 使用 Git 版本控制
- ✅ 定期推送到远程仓库
- ✅ 创建版本标签

### 2. 数据备份

在 Supabase Dashboard 中：
1. 进入 Database > Backups
2. 启用自动备份
3. 定期手动备份

---

## 成本估算

### Vercel 免费计划
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ HTTPS 证书
- ✅ 自动 CDN

### Supabase 免费计划
- ✅ 500MB 数据库
- ✅ 5GB 文件存储
- ✅ 50,000 月活用户

对于中小型项目，**完全免费**！

---

## 下一步

部署完成后：
1. ✅ 在 Supabase 中邀请用户
2. ✅ 测试所有功能
3. ✅ 配置自定义域名（可选）
4. ✅ 启用监控和分析
5. ✅ 开始使用系统！

---

## 技术支持

如遇到问题：
1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 查看 [Supabase 文档](https://supabase.com/docs)
3. 检查浏览器控制台错误
4. 联系项目维护者

---

**祝部署顺利！** 🎉

