# 🚀 GitHub Pages + Supabase 部署与重定向配置指南

本指南旨在解决在 GitHub Pages 子目录下部署时，Supabase 身份验证（注册验证、密码重置）出现的 **404 错误**问题。

## 🔍 问题原因
GitHub Pages 的静态项目通常运行在子目录下（例如：`/deci_data_collection/`）。
Supabase 的重定向机制要求：**客户端发送的 `redirectTo` 地址必须与后台白名单中的地址字符级完全匹配**。
如果匹配失败，Supabase 会 fallback（回退）到默认的 `Site URL`。如果此时 `Site URL` 配置为根域名，跳转就会指向不存在的路径，从而导致 GitHub Pages 报 404。

---

## ✅ 终极解决方案

### 1. Supabase Dashboard 配置 (Authentication -> URL Configuration)

请务必确保以下配置已**保存（Save changes）**：

*   **Site URL**: 
    `https://jianchaoci.github.io/deci_data_collection/`  
    *(注意：必须包含子目录，且建议带末尾斜杠)*

*   **Redirect URLs (白名单)**:
    添加以下两条精确路径：
    1. `https://jianchaoci.github.io/deci_data_collection/index.html`
    2. `https://jianchaoci.github.io/deci_data_collection/reset-password.html`
    3. `https://jianchaoci.github.io/deci_data_collection/**` *(作为通配符兜底)*

---

### 2. Supabase 邮件模板配置 (Authentication -> Email Templates)

这是最稳健的一步，通过在邮件中直接硬编码正确路径来绕过所有动态解析问题。

#### **Confirm signup (注册验证邮件)**
将 **Confirmation URL** 链接改为：
```html
<a href="{{ .SiteURL }}/index.html?token={{ .Token }}&type=signup">Confirm your mail</a>
```

#### **Reset password (找回密码邮件)**
将链接改为：
```html
<a href="{{ .SiteURL }}/reset-password.html?token={{ .Token }}&type=recovery&email={{ .Email }}">Reset Password</a>
```

---

### 3. 前端代码实现逻辑

项目代码（`index.html`）已针对上述配置进行了加固：
*   **注册时**：显式发送 `redirectTo` 到包含 `index.html` 的完整路径。
*   **回跳时**：自动检测 `token` 或 `access_token` 参数。如果检测到验证成功，会自动执行 `supabase.auth.signOut()`（防止静默登录）并刷新页面回到登录状态，同时给予用户成功提示。

---

## 📅 日常维护
*   **缓存问题**：GitHub Pages 有较强的缓存。如果您修改了代码，建议在测试时使用**无痕窗口**或按下 `Cmd + Shift + R` 强制刷新。
*   **新邮件**：测试时请务必点击最新的那封验证邮件，因为旧邮件中包裹的重定向指令可能指向的是旧的错误路径。

---

*祝您的数据采集工作顺利！🌿*
