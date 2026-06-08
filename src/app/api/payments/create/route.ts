export async function GET() {
  return Response.json({
    message: "Endpoint pembuatan pembayaran belum aktif. Gunakan flow pembayaran sandbox server-side yang tersedia.",
    status: "not_implemented",
  }, { status: 501 });
}
