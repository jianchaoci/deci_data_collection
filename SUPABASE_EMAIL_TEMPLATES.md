# Supabase 邮件模板配置

## 📧 确保邮件确认后不自动登录

### 问题
用户点击邮件中的"Confirm your mail"链接后，Supabase 会自动创建 session 并登录用户。

### 解决方案

#### 方法 1：配置 Supabase 邮件模板（推荐）

1. 打开 **Supabase Dashboard**
2. **Authentication** → **Email Templates**
3. 找到 **"Confirm signup"** 模板
4.修改 **Confirmation URL**:

**原来可能是**:
```
{{ .ConfirmationURL }}
```

**改为**:
```
{{ .SiteURL }}/?type=signup&token={{ .Token }}
```

这样用户点击链接后，我们的 JavaScript 代码会检测到 `type=signup`，强制退出登录。

---

#### 方法 2：禁用邮箱确认（仅测试环境）

如果只是测试，可以完全禁用邮箱确认：

1. **Supabase Dashboard**
2. **Authentication** → **Providers** → **Email**
3. 关闭 **"Confirm email"**

这样注册后直接可用，不需要邮箱确认。

---

## ✅ 当前代码已增强

`index.html` 已经添加了强制退出逻辑：

```javascript
if (type === 'signup') {
    // Sign out and clear all storage
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    
    // Show message and redirect
    alert('✅ 邮箱验证成功！\n\n请使用您的邮箱和密码登录系统。');
    window.location.href = window.location.pathname;
}
```

---

## 🧪 测试步骤

1. 注册新用户
2. 收到邮件
3. 点击确认链接
4. 应该看到成功提示
5. 然后显示登录页面（而不是项目选择页面）

---

## 📝 注意

如果还是自动登录，请检查：
1. Supabase 邮件模板配置
2. 浏览器缓存（清除缓存重试）
3. 确认 URL 包含 `?type=signup` 参数
