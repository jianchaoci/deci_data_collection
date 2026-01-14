ALTER TABLE public.phenotype_records DROP CONSTRAINT IF EXISTS phenotype_records_pk_unique;
ALTER TABLE public.phenotype_records ADD CONSTRAINT phenotype_records_pk_unique UNIQUE (user_id, date, replicate_id);
ALTER TABLE public.phenotype_records ADD COLUMN IF NOT EXISTS irrigation_ec NUMERIC;
ALTER TABLE public.phenotype_records ADD COLUMN IF NOT EXISTS irrigation_ph NUMERIC;
ALTER TABLE public.phenotype_records ADD COLUMN IF NOT EXISTS daily_yield_kg NUMERIC;
ALTER TABLE public.phenotype_records ADD COLUMN IF NOT EXISTS harvest_ear_count INTEGER;
