export async function GET() {
  return Response.json({
    message: "Endpoint upload belum aktif. Upload aset akan memakai storage setelah policy siap.",
    status: "not_implemented",
  }, { status: 501 });
}
