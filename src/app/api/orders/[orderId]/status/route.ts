export async function GET() {
  return Response.json({
    message: "Endpoint status pesanan belum aktif. Perubahan status memakai Server Actions yang tervalidasi.",
    status: "not_implemented",
  }, { status: 501 });
}
