# Supabase 密码重置配置指南

## 问题
点击密码重置邮件中的链接后显示"无法打开页面"

## 原因
Supabase 发送的邮件中包含的重置链接指向了错误的 URL（可能是 localhost）

## 解决方案

### 1. 本地测试环境配置

如果您在本地测试（localhost:8080），需要在 Supabase Dashboard 配置：

1. 登录 **Supabase Dashboard**
2. 进入您的项目
3. **Authentication** → **URL Configuration**
4. 设置以下值：

```
Site URL: http://localhost:8080
```

5. **Redirect URLs** 添加：
```
http://localhost:8080/reset-password.html
```

### 2. 生产环境配置

如果您已部署到生产环境（如 Vercel），需要：

```
Site URL: https://your-domain.vercel.app
Redirect URLs: https://your-domain.vercel.app/reset-password.html
```

### 3. 测试步骤

1. 在 Supabase Dashboard 修改配置后
2. 回到首页 http://localhost:8080/
3. 点击"忘记密码"标签
4. 输入邮箱并发送重置链接
5. 检查邮箱
6. 点击邮件中的链接
7. 应该能正常打开 reset-password.html 页面

### 4. 临时测试方法

如果邮件链接失效，可以手动测试：
1. 直接访问：http://localhost:8080/reset-password.html
2. 检查页面是否正常加载

## 注意事项

- 每次更改 Site URL 后，需要重新发送密码重置邮件
- 确保开发服务器正在运行（npm run dev）
- 端口必须与配置的 URL 一致（8080）
