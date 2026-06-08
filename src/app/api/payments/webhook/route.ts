export async function GET() {
  return Response.json({
    message: "Endpoint webhook pembayaran belum aktif.",
    status: "not_implemented",
  }, { status: 501 });
}
