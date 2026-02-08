-- Add potential_flower_count column to weekly_phenotypes table
ALTER TABLE public.weekly_phenotypes ADD COLUMN IF NOT EXISTS "潜力开花数" NUMERIC;
