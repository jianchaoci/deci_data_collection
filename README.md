# 🌱 得希表型采集系统

一个用于农业表型数据采集、统计分析和趋势可视化的现代化Web应用。

## ✨ 功能特点

- 📊 **数据采集** - 支持20个表型指标的在线采集
- 📈 **统计分析** - 自动计算累积统计指标
- 📉 **趋势分析** - 可视化展示数据趋势
- 📅 **采集日历** - 直观查看采集进度
- 🔐 **用户认证** - 基于邀请的安全登录
- 🌐 **多语言** - 支持中文/英文切换
- 📱 **响应式** - 完美适配移动端

## 🚀 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + Auth)
- **图表**: Chart.js
- **部署**: Vercel

## 🚀 部署到 GitHub Pages

项目已针对 GitHub Pages 进行优化，支持部署在子目录下。

1. **推送代码**: 将代码推送到 GitHub 仓库的 `main` 分支。
2. **开启 Pages**: 在仓库设置 `Settings -> Pages` 中，选择从 `main` 分支部署。
3. **关键配置**: 由于 GitHub Pages 的子目录路径特性，Supabase 身份验证需要特殊配置。

**⚠️ 重要：请务必阅读 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) 以正确配置 Supabase 重定向，否则会导致登录/注册时出现 404 错误。**

## 🚀 部署到 Vercel

### 方式一：通过 Git（推荐）

1. **将代码推送到 Git 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-git-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "Import Project"
   - 选择您的 Git 仓库
   - 点击 "Deploy"

### 方式二：通过 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

4. **生产部署**
   ```bash
   vercel --prod
   ```

## 🔧 配置

### 1. 设置 Supabase

在 `common.js` 中配置您的 Supabase 凭据：

```javascript
const SUPABASE_URL = 'your-supabase-url';
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';
```

### 2. 初始化数据库

在 Supabase SQL Editor 中运行 `supabase_schema.sql`：

```sql
-- 创建表
CREATE TABLE phenotype_records (...);
CREATE TABLE weekly_statistics (...);

-- 设置 RLS 策略
-- 创建索引
```

### 3. 邀请用户

在 Supabase Dashboard 中：
1. 进入 Authentication > Users
2. 点击 "Invite User"
3. 输入用户邮箱
4. 用户会收到邀请邮件

## 📊 数据结构

### phenotype_records (采集数据表)
- 存储每个样本的原始采集数据
- 30个样本/周 = 30行/周
- 20个表型指标

### weekly_statistics (统计指标表)
- 存储每周的统计指标
- 1周 = 1行
- 基于30个样本计算的汇总数据

## 🎯 使用流程

1. **登录** - 使用邀请邮箱登录
2. **数据采集** - 在"数据采集"页面输入表型数据
3. **查看统计** - 在"统计数量"页面查看汇总指标
4. **分析趋势** - 在"趋势分析"页面查看数据变化
5. **导出数据** - 下载CSV格式的数据报表

## 📱 页面说明

- **首页** (`index.html`) - 功能导航和系统介绍
- **采集日历** (`calendar.html`) - 查看采集进度日历
- **数据采集** (`collection.html`) - 输入表型数据
- **统计数量** (`statistics.html`) - 查看累积统计
- **趋势分析** (`trends.html`) - 可视化趋势图表

## 🔐 安全性

- ✅ Row Level Security (RLS) 启用
- ✅ 用户只能访问自己的数据
- ✅ 基于邀请的用户注册
- ✅ HTTPS 加密传输（Vercel 自动提供）

## 📝 开发说明

### 文件结构
```
deci_data_collection/
├── index.html              # 首页
├── welcome.html            # 登录页
├── calendar.html           # 日历页
├── collection.html         # 采集页
├── statistics.html         # 统计页
├── trends.html             # 趋势页
├── common.css              # 全局样式
├── common.js               # 共享逻辑
├── vercel.json             # Vercel 配置
├── supabase_schema.sql     # 数据库架构
└── README.md               # 项目说明
```

### 代码规范
- ES6+ 语法
- 模块化设计
- 注释清晰
- 响应式布局

## 🐛 故障排查

### 数据库连接失败
- 检查 Supabase URL 和 API Key
- 确认 RLS 策略已正确配置

### 用户无法登录
- 确认用户已被邀请
- 检查邮箱地址是否正确
- 查看浏览器控制台错误信息

### 数据不显示
- 确认已采集数据
- 检查数据库表是否正确创建
- 验证用户权限

## 📈 性能优化

- ✅ 静态资源 CDN 加速
- ✅ 图片懒加载
- ✅ 数据库查询优化
- ✅ 索引优化

## 🔄 更新日志

### v2.0.0 (2025-12-14)
- ✅ 重新设计数据库结构（双表方案）
- ✅ 优化数据采集流程
- ✅ 增强趋势分析功能
- ✅ 改进用户认证系统
- ✅ 修复已知问题

### v1.0.0 (2025-12-01)
- ✅ 初始版本发布
- ✅ 基础数据采集功能
- ✅ 统计分析功能
- ✅ 用户认证系统

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License

## 📧 联系方式

如有问题，请联系项目维护者。

---

Made with ❤️ for Agricultural Research
