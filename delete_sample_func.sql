-- 创建一个函数来安全地删除样本并移动后续样本的ID
-- 这确保了样本列表（数组）和数据库ID（整数）保持一致的映射关系
CREATE OR REPLACE FUNCTION delete_sample_and_shift(target_rep_id INTEGER)
RETURNS VOID AS $$
BEGIN
    -- 1. 删除目标样本的所有数据 (Weekly & Daily)
    DELETE FROM public.weekly_phenotypes 
    WHERE user_id = auth.uid() AND replicate_id = target_rep_id;
    
    DELETE FROM public.daily_phenotypes 
    WHERE user_id = auth.uid() AND replicate_id = target_rep_id;

    -- 2. 将 ID > target_rep_id 的样本数据向前移动一位 (ID - 1)
    -- 这样它们就能匹配前端数组 splice 后的新索引
    UPDATE public.weekly_phenotypes
    SET replicate_id = replicate_id - 1
    WHERE user_id = auth.uid() AND replicate_id > target_rep_id;

    UPDATE public.daily_phenotypes
    SET replicate_id = replicate_id - 1
    WHERE user_id = auth.uid() AND replicate_id > target_rep_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
