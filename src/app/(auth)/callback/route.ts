export async function GET(request: Request) {
  const url = new URL(request.url);
  return Response.redirect(new URL("/umkm/dashboard", url.origin));
}
