import { beforeEach, describe, expect, it, vi } from "vitest";

const { revalidatePath, rpc } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  rpc: vi.fn(),
}));

vi.mock("next/cache", () => ({ revalidatePath }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ rpc })),
}));

import { markSandboxPaymentAsPaidWithState } from "./payment-actions";

describe("payment action without email delivery", () => {
  beforeEach(() => {
    revalidatePath.mockClear();
    rpc.mockReset();
  });

  it("returns payment success after the database RPC succeeds", async () => {
    rpc.mockResolvedValue({ data: "order-1", error: null });
    const formData = new FormData();
    formData.set("paymentId", "payment-1");

    const result = await markSandboxPaymentAsPaidWithState(
      { message: "", ok: false },
      formData,
    );

    expect(rpc).toHaveBeenCalledWith("mark_sandbox_payment_as_paid", {
      target_payment_id: "payment-1",
    });
    expect(result).toEqual({
      message: "Pembayaran berhasil diproses.",
      ok: true,
      redirectTo: "/umkm/orders/order-1?paid=1",
    });
    expect(revalidatePath).toHaveBeenCalledWith("/umkm/orders/order-1");
  });
});
