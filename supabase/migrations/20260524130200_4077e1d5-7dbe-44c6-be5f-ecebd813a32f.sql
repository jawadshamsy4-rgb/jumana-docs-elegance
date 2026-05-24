WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY sort_order, created_at) AS rn
  FROM public.services
)
UPDATE public.services s
SET sort_order = ranked.rn
FROM ranked
WHERE s.id = ranked.id;