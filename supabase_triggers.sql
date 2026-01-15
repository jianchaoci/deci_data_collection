-- =============================================
-- Supabase 自动计算触发器
-- 用于自动计算统计字段，无需前端处理
-- 
-- 使用方法：在 Supabase Dashboard > SQL Editor 中执行此脚本
-- 
-- 自动计算的字段：
-- 1. 单头累计坐果粒数 = 该样本所有周 "本周单头新增坐果数" 的累计求和
-- 2. 单头产量 = 该样本所有周 "单穗重" 的累计求和
-- =============================================

-- ============================================
-- 1. 确保计算列存在
-- ============================================
DO $$
BEGIN
    -- 检查并添加 "单头累计坐果粒数" 列
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'weekly_phenotypes' 
        AND column_name = '单头累计坐果粒数'
    ) THEN
        ALTER TABLE public.weekly_phenotypes ADD COLUMN "单头累计坐果粒数" NUMERIC;
        RAISE NOTICE '已添加列: 单头累计坐果粒数';
    ELSE
        RAISE NOTICE '列已存在: 单头累计坐果粒数';
    END IF;

    -- 检查并添加 "单头产量" 列
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'weekly_phenotypes' 
        AND column_name = '单头产量'
    ) THEN
        ALTER TABLE public.weekly_phenotypes ADD COLUMN "单头产量" NUMERIC;
        RAISE NOTICE '已添加列: 单头产量';
    ELSE
        RAISE NOTICE '列已存在: 单头产量';
    END IF;
END $$;

-- ============================================
-- 2. 创建统一的计算函数
-- ============================================
-- 该函数在每次 INSERT 或 UPDATE 时自动执行
-- 同时计算多个累计字段

CREATE OR REPLACE FUNCTION calculate_weekly_statistics()
RETURNS TRIGGER AS $$
DECLARE
    -- 用于 单头累计坐果粒数
    hist_grain_sum NUMERIC;
    hist_grain_count INTEGER;
    -- 用于 单头产量
    hist_yield_sum NUMERIC;
    hist_yield_count INTEGER;
BEGIN
    -- ========================================
    -- 计算 1: 单头累计坐果粒数
    -- 公式: SUM(本周单头新增坐果数) 从第一周到当前周
    -- 注意: NULL 值会被跳过，不参与计算
    -- ========================================
    
    -- 查询历史数据 (SUM 自动忽略 NULL)
    SELECT COALESCE(SUM("本周单头新增坐果数"), 0), COUNT("本周单头新增坐果数")
    INTO hist_grain_sum, hist_grain_count
    FROM public.weekly_phenotypes
    WHERE user_id = NEW.user_id
      AND replicate_id = NEW.replicate_id
      AND "本周单头新增坐果数" IS NOT NULL  -- 明确只查询非 NULL 记录
      AND (
          year < NEW.year 
          OR (year = NEW.year AND week < NEW.week)
      );
    
    -- 如果当前行有值，加入计算；如果是 NULL，跳过当前行
    IF NEW."本周单头新增坐果数" IS NOT NULL THEN
        NEW."单头累计坐果粒数" := hist_grain_sum + NEW."本周单头新增坐果数";
    ELSIF hist_grain_count > 0 THEN
        -- 当前行为 NULL，但有历史数据，使用历史累计
        NEW."单头累计坐果粒数" := hist_grain_sum;
    ELSE
        -- 当前行为 NULL，且无历史数据，保持 NULL
        NEW."单头累计坐果粒数" := NULL;
    END IF;

    -- ========================================
    -- 计算 2: 单头产量
    -- 公式: SUM(单穗重) 从第一周到当前周
    -- 注意: NULL 值会被跳过，不参与计算
    -- ========================================
    
    -- 查询历史数据 (SUM 自动忽略 NULL)
    SELECT COALESCE(SUM("单穗重"), 0), COUNT("单穗重")
    INTO hist_yield_sum, hist_yield_count
    FROM public.weekly_phenotypes
    WHERE user_id = NEW.user_id
      AND replicate_id = NEW.replicate_id
      AND "单穗重" IS NOT NULL  -- 明确只查询非 NULL 记录
      AND (
          year < NEW.year 
          OR (year = NEW.year AND week < NEW.week)
      );
    
    -- 如果当前行有值，加入计算；如果是 NULL，跳过当前行
    IF NEW."单穗重" IS NOT NULL THEN
        NEW."单头产量" := hist_yield_sum + NEW."单穗重";
    ELSIF hist_yield_count > 0 THEN
        -- 当前行为 NULL，但有历史数据，使用历史累计
        NEW."单头产量" := hist_yield_sum;
    ELSE
        -- 当前行为 NULL，且无历史数据，保持 NULL
        NEW."单头产量" := NULL;
    END IF;

    -- ========================================
    -- 调试日志
    -- ========================================
    RAISE LOG '自动计算统计: user=%, replicate=%, year=%, week=% | 累计坐果粒数: %(历史, %条)+%(当前)=% | 单头产量: %(历史, %条)+%(当前)=%',
        NEW.user_id, NEW.replicate_id, NEW.year, NEW.week,
        hist_grain_sum, hist_grain_count, NEW."本周单头新增坐果数", NEW."单头累计坐果粒数",
        hist_yield_sum, hist_yield_count, NEW."单穗重", NEW."单头产量";
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 3. 删除旧触发器（如果存在）
-- ============================================
DROP TRIGGER IF EXISTS trigger_calculate_accum_grain ON public.weekly_phenotypes;
DROP TRIGGER IF EXISTS trigger_calculate_weekly_stats ON public.weekly_phenotypes;

-- ============================================
-- 4. 创建新触发器
-- ============================================
CREATE TRIGGER trigger_calculate_weekly_stats
    BEFORE INSERT OR UPDATE ON public.weekly_phenotypes
    FOR EACH ROW
    EXECUTE FUNCTION calculate_weekly_statistics();

-- ============================================
-- 5. 可选：更新历史数据
-- ============================================
-- 如果表中已有历史数据，取消注释并执行以下更新

/*
-- 更新 单头累计坐果粒数
UPDATE public.weekly_phenotypes w1
SET "单头累计坐果粒数" = (
    SELECT COALESCE(SUM("本周单头新增坐果数"), 0)
    FROM public.weekly_phenotypes w2
    WHERE w2.user_id = w1.user_id
      AND w2.replicate_id = w1.replicate_id
      AND (w2.year < w1.year OR (w2.year = w1.year AND w2.week <= w1.week))
);

-- 更新 单头产量
UPDATE public.weekly_phenotypes w1
SET "单头产量" = (
    SELECT COALESCE(SUM("单穗重"), 0)
    FROM public.weekly_phenotypes w2
    WHERE w2.user_id = w1.user_id
      AND w2.replicate_id = w1.replicate_id
      AND (w2.year < w1.year OR (w2.year = w1.year AND w2.week <= w1.week))
);
*/

-- ============================================
-- 6. 验证触发器
-- ============================================
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'weekly_phenotypes'
  AND trigger_schema = 'public';

-- ============================================
-- 完成！
-- ============================================
-- 自动计算字段:
-- 1. 单头累计坐果粒数 = SUM(本周单头新增坐果数) 累计到当前周
-- 2. 单头产量 = SUM(单穗重) 累计到当前周
--
-- 测试:
-- INSERT INTO weekly_phenotypes 
--   (user_id, year, week, replicate_id, "本周单头新增坐果数", "单穗重")
-- VALUES ('your-user-id', 2026, 3, 1, 10, 150);
-- 
-- SELECT year, week, "本周单头新增坐果数", "单头累计坐果粒数", "单穗重", "单头产量"
-- FROM weekly_phenotypes WHERE replicate_id = 1 ORDER BY year, week;
