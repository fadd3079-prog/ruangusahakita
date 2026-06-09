export async function GET() {
  return Response.json({
    message: "Upload avatar kreator dan gambar portofolio sudah ditangani lewat Server Action role-scoped. Endpoint upload generik belum masuk scope fase ini.",
    status: "scoped_to_creator_actions",
  }, { status: 501 });
}
