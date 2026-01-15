-- 1. 添加列 "单头累计坐果粒数"
ALTER TABLE public.weekly_phenotypes 
ADD COLUMN IF NOT EXISTS "单头累计坐果粒数" NUMERIC DEFAULT 0;

-- 2. 创建触发器函数：计算累计值
CREATE OR REPLACE FUNCTION update_accumulated_grain_count()
RETURNS TRIGGER AS $$
DECLARE
    history_sum NUMERIC;
BEGIN
    -- 计算该样本在当前周之前的所有“本周单头新增坐果数”之和
    SELECT COALESCE(SUM("本周单头新增坐果数"), 0)
    INTO history_sum
    FROM public.weekly_phenotypes
    WHERE user_id = NEW.user_id
      AND replicate_id = NEW.replicate_id
      AND (year < NEW.year OR (year = NEW.year AND week < NEW.week));
      -- 注意：严格小于当前周，排除当前行（因为是 BEFORE 触发器，当前行还没写入/更新）

    -- 当前行的“单头累计坐果粒数” = 历史总和 + 当前周的新增数
    NEW."单头累计坐果粒数" := history_sum + COALESCE(NEW."本周单头新增坐果数", 0);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. 创建触发器
DROP TRIGGER IF EXISTS trigger_update_accum_grain ON public.weekly_phenotypes;

CREATE TRIGGER trigger_update_accum_grain
BEFORE INSERT OR UPDATE
ON public.weekly_phenotypes
FOR EACH ROW
EXECUTE FUNCTION update_accumulated_grain_count();

-- 4. 触发一次全表更新以计算现有数据的累计值（可选，谨慎运行）
-- UPDATE public.weekly_phenotypes SET id = id;
