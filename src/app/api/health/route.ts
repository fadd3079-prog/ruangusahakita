export async function GET() {
  return Response.json({
    ok: true,
    route: "health",
  });
}
