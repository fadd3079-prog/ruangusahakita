UPDATE creator_profiles cp
SET starting_price = COALESCE(sub.min_price, 0),
    updated_at = now()
FROM (
  SELECT
    sp.creator_id,
    MIN(spt.price) AS min_price
  FROM service_packages sp
  JOIN service_package_tiers spt ON spt.service_package_id = sp.id
  WHERE sp.is_active = true
    AND sp.deleted_at IS NULL
    AND spt.is_active = true
    AND spt.price > 0
  GROUP BY sp.creator_id
) sub
WHERE cp.id = sub.creator_id
  AND cp.starting_price IS DISTINCT FROM COALESCE(sub.min_price, 0);

-- Also reset creators who have NO active tiers but still have a non-zero starting_price
UPDATE creator_profiles cp
SET starting_price = 0,
    updated_at = now()
WHERE cp.starting_price <> 0
  AND NOT EXISTS (
    SELECT 1
    FROM service_packages sp
    JOIN service_package_tiers spt ON spt.service_package_id = sp.id
    WHERE sp.creator_id = cp.id
      AND sp.is_active = true
      AND sp.deleted_at IS NULL
      AND spt.is_active = true
      AND spt.price > 0
  );
