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

## 🔑 Supabase API 凭据配置

要让前端网页能够连接到您的 Supabase 数据库，您需要配置 API 密钥和项目地址。

### 1. 获取凭据
1. 登录 **Supabase Dashboard**。
2. 进入 **Project Settings** (左侧底部的齿轮图标) -> **API**。
3. 在 **Project API keys** 部分复制：
   - `Project URL` (存储在 `URL` 框中)
   - `anon public` (存储在 `API Key` 框中的公共 Key)

### 2. 修改代码
在您的项目根目录中找到 **`common.js`** 文件，并将以下变量替换为您的真实数据：

```javascript
// /Users/jianchaoci/app_developments/deci_data_collection/common.js

const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_ANON_KEY = '你的公共ANON_KEY';
```

---

## 🏗️ Supabase 数据库配置

除了 URL 重定向，您还需要初始化数据库表结构及权限（RLS）。

### 1. 初始化表结构
在 Supabase 的 **SQL Editor** 中运行以下 SQL（这是 V2 版本的核心架构）：

```sql
-- 创建温室参数表（核心设置）
CREATE TABLE IF NOT EXISTS facility_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    greenhouse_area NUMERIC, -- 温室面积
    arrow_count INTEGER,     -- 滴箭个数
    sample_names TEXT[],     -- 预设样本名称列表
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, project_name)
);

-- 创建每周表型数据表
CREATE TABLE IF NOT EXISTS weekly_phenotypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    sample_name TEXT NOT NULL,
    year INTEGER NOT NULL,
    week INTEGER NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, project_name, sample_name, year, week)
);

-- 创建每日表型数据表
CREATE TABLE IF NOT EXISTS daily_phenotypes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    sample_name TEXT NOT NULL,
    date DATE NOT NULL,
    year INTEGER NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    arrow_snapshot INTEGER, -- 记录录入时的滴箭快照
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, project_name, sample_name, date)
);
```

---

## ✅ 终极解决方案

### 2. 配置自动计算触发器 (V2 核心逻辑)

为了确保指标录入时自动计算（如回液比例、单位产量、每周累积等），请务必在 SQL Editor 中运行对应脚本：

#### A. 每周数据逻辑 (累积计算)
```sql
CREATE OR REPLACE FUNCTION update_weekly_calculations()
RETURNS TRIGGER AS $$
DECLARE
    accum_grain NUMERIC;
    accum_yield NUMERIC;
BEGIN
    -- 计算单头累计坐果粒数
    SELECT COALESCE(SUM("本周单头新增坐果数"), 0) INTO accum_grain
    FROM public.weekly_phenotypes
    WHERE user_id = NEW.user_id AND sample_name = NEW.sample_name
      AND (year < NEW.year OR (year = NEW.year AND week < NEW.week));
    NEW."单头累计坐果粒数" := accum_grain + COALESCE(NEW."本周单头新增坐果数", 0);

    -- 计算单头累计产量
    SELECT COALESCE(SUM("单穗重"), 0) INTO accum_yield
    FROM public.weekly_phenotypes
    WHERE user_id = NEW.user_id AND sample_name = NEW.sample_name
      AND (year < NEW.year OR (year = NEW.year AND week < NEW.week));
    NEW."单头产量" := accum_yield + COALESCE(NEW."单穗重", 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_weekly_calc
BEFORE INSERT OR UPDATE ON public.weekly_phenotypes
FOR EACH ROW EXECUTE FUNCTION update_weekly_calculations();
```

#### B. 每日数据逻辑 (回液比例与单位产量)
```sql
CREATE OR REPLACE FUNCTION update_daily_calculations()
RETURNS TRIGGER AS $$
DECLARE
    v_area NUMERIC;
    v_weekly_sum NUMERIC;
    v_total_sum NUMERIC;
BEGIN
    -- 1. 自动填充滴箭个数快照
    IF NEW."滴箭个数" IS NULL THEN
        SELECT "滴箭个数" INTO NEW."滴箭个数"
        FROM public.facility_settings
        WHERE user_id = NEW.user_id AND "project_name" = NEW.project_name;
    END IF;

    -- 2. 计算回液比例
    IF NEW."灌溉量" > 0 AND NEW."回液量" IS NOT NULL AND NEW."滴箭个数" > 0 THEN
        NEW."回液比例" := (NEW."回液量" / (NEW."灌溉量" * NEW."滴箭个数")) * 100;
    END IF;

    -- 3. 计算周/总产量（从 facility_settings 实时读取面积）
    IF NEW."每天产量" IS NOT NULL THEN
        SELECT COALESCE(SUM("每天产量"), 0) INTO v_weekly_sum FROM public.daily_phenotypes
        WHERE user_id = NEW.user_id AND project_name = NEW.project_name 
          AND year = NEW.year AND week = NEW.week AND date != NEW.date;
        NEW."单周产量" := v_weekly_sum + NEW."每天产量";

        SELECT COALESCE(SUM("每天产量"), 0) INTO v_total_sum FROM public.daily_phenotypes
        WHERE user_id = NEW.user_id AND project_name = NEW.project_name AND date != NEW.date;
        NEW."总产量" := v_total_sum + NEW."每天产量";

        SELECT "温室面积" INTO v_area FROM public.facility_settings
        WHERE user_id = NEW.user_id AND "project_name" = NEW.project_name;
        IF v_area > 0 THEN NEW."单位产量" := NEW."总产量" / v_area; END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_calc
BEFORE INSERT OR UPDATE ON public.daily_phenotypes
FOR EACH ROW EXECUTE FUNCTION update_daily_calculations();
```

### 3. 配置 RLS 安全策略 (重要)
为了确保用户只能看到自己的数据，必须启用 Row Level Security：

```sql
-- 启用 RLS
ALTER TABLE facility_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_phenotypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_phenotypes ENABLE ROW LEVEL SECURITY;

-- 创建策略：仅允许用户操作属于自己的数据
CREATE POLICY "Users can manage their own facility settings" 
ON facility_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own weekly data" 
ON weekly_phenotypes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own daily data" 
ON daily_phenotypes FOR ALL USING (auth.uid() = user_id);
```

---

## 📅 日常维护
*   **缓存问题**：GitHub Pages 有较强的缓存。如果您修改了代码，建议在测试时使用**无痕窗口**或按下 `Cmd + Shift + R` 强制刷新。
*   **新邮件**：测试时请务必点击最新的那封验证邮件，因为旧邮件中包裹的重定向指令可能指向的是旧的错误路径。

---

*祝您的数据采集工作顺利！🌿*
