export function buildSlug(value, fallback = "item") {
  const slug = String(value || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || fallback;
}

export function buildUniqueSlug(value, suffix) {
  const base = buildSlug(value);
  return suffix ? `${base}-${String(suffix).slice(0, 8)}` : base;
}
