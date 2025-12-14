# 🚀 快速开始指南

## 5分钟部署到 Vercel

### 前提条件
- ✅ 已有 Supabase 账户并创建项目
- ✅ 已运行 `supabase_schema.sql` 创建数据库表
- ✅ 已在 `common.js` 中配置 Supabase URL 和 Key

---

## 方法一：一键部署（最快）

### 步骤 1: 安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤 2: 登录并部署

```bash
# 登录
vercel login

# 部署
vercel --prod
```

### 步骤 3: 配置 Supabase

在 Supabase Dashboard → Authentication → URL Configuration 中添加：
- Site URL: `https://your-project.vercel.app`
- Redirect URLs: `https://your-project.vercel.app/**`

### 完成！🎉

访问您的网站：`https://your-project.vercel.app`

---

## 方法二：使用部署脚本

### Windows (PowerShell)

```powershell
.\deploy.ps1
```

### macOS/Linux (Bash)

```bash
chmod +x deploy.sh
./deploy.sh
```

按照提示选择部署类型即可。

---

## 方法三：通过 Git 仓库

### 步骤 1: 推送到 Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 步骤 2: 在 Vercel 中导入

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择您的 Git 仓库
4. 点击 "Deploy"

### 步骤 3: 配置 Supabase

同方法一的步骤 3。

---

## 部署后必做的事

### 1. 测试登录
- 在 Supabase 中邀请一个测试用户
- 使用该用户登录系统
- 确认登录成功

### 2. 测试数据采集
- 进入"数据采集"页面
- 选择一个样本
- 输入一些测试数据
- 点击"提交数据"
- 确认数据保存成功

### 3. 测试统计功能
- 进入"统计数量"页面
- 输入配置参数（温室面积、滴箭个数）
- 保存配置
- 查看统计指标是否正确

### 4. 测试趋势分析
- 进入"趋势分析"页面
- 选择一个指标
- 查看趋势图是否正常显示

---

## 常见问题快速解决

### ❌ 页面空白
```bash
# 检查控制台错误
F12 → Console

# 常见原因：
# 1. Supabase 配置错误 → 检查 common.js
# 2. 文件路径错误 → 检查 vercel.json
```

### ❌ 登录失败
```bash
# 检查 Supabase URL 配置
# 1. 进入 Supabase Dashboard
# 2. Authentication → URL Configuration
# 3. 添加您的 Vercel URL
```

### ❌ 数据无法保存
```bash
# 检查 RLS 策略
# 1. 确认已运行 supabase_schema.sql
# 2. 在 Supabase Table Editor 中检查 RLS
# 3. 确认用户已正确登录
```

---

## 下一步

### 邀请用户
在 Supabase Dashboard → Authentication → Users 中：
1. 点击 "Invite User"
2. 输入用户邮箱
3. 用户会收到邀请邮件

### 自定义域名（可选）
在 Vercel Dashboard → Settings → Domains 中：
1. 添加自定义域名
2. 配置 DNS
3. 等待 SSL 证书生效

### 启用监控（可选）
在 Vercel Dashboard → Analytics 中：
1. 启用 Analytics
2. 查看访问统计
3. 监控性能指标

---

## 完整部署流程图

```
┌─────────────────────────────────────┐
│  1. 准备 Supabase                    │
│     - 创建项目                       │
│     - 运行 SQL 脚本                  │
│     - 获取 URL 和 Key                │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  2. 配置代码                         │
│     - 更新 common.js                 │
│     - 检查所有文件                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  3. 部署到 Vercel                    │
│     - vercel --prod                  │
│     - 或通过 Git 集成                │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  4. 配置 Supabase URL                │
│     - 添加 Vercel URL                │
│     - 配置 Redirect URLs             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  5. 测试功能                         │
│     - 登录测试                       │
│     - 数据采集测试                   │
│     - 统计分析测试                   │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│  6. 邀请用户                         │
│     - 在 Supabase 中邀请             │
│     - 用户收到邮件                   │
│     - 开始使用系统                   │
└─────────────────────────────────────┘
```

---

## 时间估算

- **准备 Supabase**: 5 分钟
- **配置代码**: 2 分钟
- **部署到 Vercel**: 3 分钟
- **配置和测试**: 5 分钟

**总计**: 约 15 分钟 ⏱️

---

## 需要帮助？

### 查看文档
- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- `DEPLOYMENT_CHECKLIST.md` - 部署检查清单
- `USAGE_GUIDE.md` - 系统使用指南

### 检查日志
- Vercel Dashboard → Deployments → Logs
- 浏览器 F12 → Console
- Supabase Dashboard → Logs

### 常见资源
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Chart.js 文档](https://www.chartjs.org/docs/)

---

**现在就开始部署吧！** 🚀

