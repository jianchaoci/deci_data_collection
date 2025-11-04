# 🌱 植物表型数据采集系统

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> 现代化的植物表型数据采集系统，支持云端同步和响应式设计

## ✨ 特性

- 🎛️ 直观的滑块式数据输入界面
- ☁️ 自动同步到Dropbox云端存储
- 📅 交互式日历查看历史数据
- 📱 支持手机、平板、电脑响应式设计
- 🔒 安全的OAuth2认证
- 🌿 专为植物表型学设计

## 🌐 GitHub Pages部署

### 1. 创建GitHub仓库并上传文件

```bash
# 1. 创建新仓库或fork现有仓库
# 2. 克隆到本地
git clone https://github.com/YOUR_USERNAME/deci_ui.git
cd deci_ui

# 3. 添加所有文件
git add .
git commit -m "Initial commit: Plant phenotyping data collection system"
git push origin main
```

### 2. 启用GitHub Pages

1. 访问你的GitHub仓库
2. 点击 **Settings** 选项卡
3. 在左侧菜单找到 **Pages**
4. Source选择 **"Deploy from a branch"**
5. 选择 **main** 分支和 **/ (root)** 目录
6. 点击 **Save**

### 3. 获取你的GitHub Pages地址

部署完成后，你的系统将在以下地址可用：
```
https://YOUR_USERNAME.github.io/deci_ui/
```

### 4. 配置Dropbox重定向URI

1. 访问 [Dropbox开发者控制台](https://www.dropbox.com/developers/apps)
2. 选择你的应用 → **设置** → **OAuth 2**
3. 在**重定向URI**中添加：
   ```
   https://YOUR_USERNAME.github.io/deci_ui/
   ```
4. 点击**添加**并保存

## 🚀 快速开始

### 本地开发和测试

```bash
# 启动本地服务器
python -m http.server 8000

# 访问地址
http://localhost:8000
```

### 在线使用

1. 访问你的GitHub Pages地址
2. 系统会自动检测当前环境
3. 点击"连接到Dropbox"进行授权
4. 开始采集植物数据

## 📁 文件结构

```
deci_ui/
├── index.html              # 主应用文件
├── troubleshoot.html       # 诊断工具
├── network-guide.html      # 网络环境指南
├── redirect-guide.html     # 重定向URI配置指南
├── CONFIG.md               # 配置说明
├── README-usage.md         # 使用说明
└── README.md               # 项目说明（本文件）
```

## 🔧 配置说明

### APP Key配置
- 当前APP Key: `j38wp0xvibd9bjq`
- 如需更换，编辑 `index.html` 第809行

### 重定向URI配置
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/deci_ui/`
- **本地开发**: `http://localhost:8000/`

## 🌐 部署选项对比

| 部署方式 | URL格式 | 稳定性 | 适用场景 |
|---------|---------|--------|----------|
| **GitHub Pages** | `https://username.github.io/repo/` | ✅ 高 | 团队协作、公开使用 |
| 本地服务器 | `http://localhost:8000/` | ✅ 高 | 个人使用、开发测试 |
| Netlify | `https://app-name.netlify.app/` | ✅ 高 | 专业部署 |
| Vercel | `https://app-name.vercel.app/` | ✅ 高 | 现代化部署 |

## 📊 数据字段

表单包含以下植物表型检测字段：
- **基本信息**：检测信息描述
- **生长指标**：生长量(cm)、茎粗(mm)、叶片数(个)、叶长(cm)、叶宽(cm)
- **开花指标**：潜力开花数(串)、当前开花序数(串)
- **坐果指标**：单头累计坐果穗数(个)、单头累计坐果粒数(个)
- **产量指标**：单位产量(kg/㎡)、单粒果重(g)、单头总采收果穗数(个)等
- **品质指标**：可溶性固形物(°Brix)、酸度、裂果率(%)
- **管理指标**：灌溉量(ml)、回液量(ml)、回液EC(mS/cm)、回液PH

## 🛠️ 系统功能

- **智能数据输入**：滑块式界面，实时值显示
- **自动时间戳**：每条记录自动添加提交时间
- **数据验证**：必填字段检查和格式验证
- **CSV预览**：提交前可预览生成的CSV内容
- **持久授权**：Dropbox授权信息保存在本地
- **历史数据**：交互式日历查看采集记录
- **网络诊断**：智能检测重定向URI配置

## 🔒 安全性

- 使用OAuth2 PKCE流程，前端无需存储秘密信息
- 访问令牌仅保存在本地浏览器
- 支持令牌过期检测和自动重新授权
- APP Key直接配置，简化了复杂的加密系统

## 🆘 故障排除

- 📖 [使用说明](README-usage.md)
- 🔧 [配置指南](CONFIG.md)
- 🌐 [网络环境指南](network-guide.html)
- 🛠️ [诊断工具](troubleshoot.html)

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

🌱 **得希表型采集系统** - 让植物数据采集更简单高效