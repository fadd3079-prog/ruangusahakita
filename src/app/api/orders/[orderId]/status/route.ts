export async function GET() {
  return Response.json({
    ok: true,
    route: "orders/[orderId]/status",
  });
}
