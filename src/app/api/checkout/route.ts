export async function GET() {
  return Response.json({
    message: "Endpoint checkout belum aktif. Gunakan alur checkout server-side yang tersedia.",
    status: "not_implemented",
  }, { status: 501 });
}
