export async function GET() {
  return Response.json({
    message: "Upload avatar, banner, cover layanan, portofolio, logo UMKM, dan aset brief ditangani lewat Server Action role-scoped. Endpoint upload generik belum masuk scope fase ini.",
    status: "scoped_to_creator_actions",
  }, { status: 501 });
}
