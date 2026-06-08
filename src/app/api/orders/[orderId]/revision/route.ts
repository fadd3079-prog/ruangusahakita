export async function GET() {
  return Response.json({
    message: "Endpoint revisi belum aktif. Alur revisi akan memakai validasi server-side.",
    status: "not_implemented",
  }, { status: 501 });
}
