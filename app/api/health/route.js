export const runtime = "nodejs";

export async function GET() {
  return Response.json({
    ok: true,
    app: "PayRent",
    mode: process.env.PAYMENT_INITIATION_ENABLED === "true" ? "payment-gated" : "demo",
    paymentInitiationEnabled: process.env.PAYMENT_INITIATION_ENABLED === "true",
    timestamp: new Date().toISOString()
  });
}
