/**
 * Retroactive sync: creator_profiles.starting_price
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/sync-starting-prices.js
 *
 * This script computes the minimum active tier price for each creator
 * and updates creator_profiles.starting_price accordingly.
 * Creators with no active tiers are reset to 0.
 */

const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data: tiers, error: tierErr } = await supabase
    .from("service_package_tiers")
    .select("price, service_packages!inner(creator_id, is_active, deleted_at)")
    .eq("service_packages.is_active", true)
    .is("service_packages.deleted_at", null)
    .eq("is_active", true);

  if (tierErr) {
    console.error("Failed to fetch tiers:", tierErr);
    process.exit(1);
  }

  const creatorPrices = {};
  for (const t of tiers || []) {
    const cid = t.service_packages.creator_id;
    const p = Number(t.price);
    if (p > 0) {
      if (!creatorPrices[cid] || p < creatorPrices[cid]) {
        creatorPrices[cid] = p;
      }
    }
  }

  console.log("Computed min prices per creator:");
  for (const [cid, price] of Object.entries(creatorPrices)) {
    console.log("  " + cid + " => " + price);
  }

  for (const [cid, price] of Object.entries(creatorPrices)) {
    const { error } = await supabase
      .from("creator_profiles")
      .update({ starting_price: price })
      .eq("id", cid);
    console.log(
      "UPDATE " + cid + ": " + (error ? JSON.stringify(error) : "OK (" + price + ")")
    );
  }

  const { data: allCreators } = await supabase
    .from("creator_profiles")
    .select("id, display_name, starting_price");

  for (const c of allCreators || []) {
    if (!creatorPrices[c.id] && Number(c.starting_price) !== 0) {
      const { error } = await supabase
        .from("creator_profiles")
        .update({ starting_price: 0 })
        .eq("id", c.id);
      console.log(
        "RESET " +
          c.display_name +
          " (" +
          c.id +
          "): " +
          (error ? JSON.stringify(error) : "OK (0)")
      );
    }
  }

  const { data: after } = await supabase
    .from("creator_profiles")
    .select("id, display_name, starting_price")
    .order("display_name");

  console.log("\n=== FINAL RESULTS ===");
  for (const c of after || []) {
    console.log(
      "  " + c.display_name + ": Rp " + Number(c.starting_price).toLocaleString("id-ID")
    );
  }
}

main().catch(console.error);
