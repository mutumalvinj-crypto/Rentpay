import { randomUUID } from "node:crypto";

export const runtime = "nodejs";

/**
 * Payment initiation is deliberately disabled by default.
 * A real implementation must first bind a server-authenticated tenant to an
 * active occupancy, validate the outstanding obligation, create an idempotent
 * intent, and call an approved provider adapter. Never trust browser-supplied
 * tenant IDs or treat this placeholder response as a payment.
 */
export async function POST() {
  if (process.env.PAYMENT_INITIATION_ENABLED !== "true" ||
      process.env.PAYMENT_PROVIDER_MODE !== "approved") {
    return Response.json({
      ok: false,
      code: "PAYMENT_INITIATION_DISABLED",
      message: "PayRent payment initiation is unavailable until provider approval and payment-integrity release checks are complete."
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  // Fail closed even if someone flips the flags without deploying a reviewed,
  // authenticated provider implementation.
  return Response.json({
    ok: false,
    code: "PROVIDER_ADAPTER_NOT_IMPLEMENTED",
    requestId: randomUUID(),
    message: "No approved provider adapter is installed. No payment was initiated."
  }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
