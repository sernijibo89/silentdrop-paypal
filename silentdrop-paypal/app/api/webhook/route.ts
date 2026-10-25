import { NextResponse } from "next/server";

// 1. Simulated store endpoint
async function sendToStore(payload: any) {
  // Store fails if it does not get flat order_id and amount
  if (!payload.order_id || !payload.amount) {
    throw new Error("Invalid Schema: Missing required fields 'order_id' or 'amount'");
  }
  return { status: 200, message: "Order processed successfully" };
}

// 2. AI Repair helper
async function healPayloadWithAI(rawPayload: any, errorMessage: string) {
  const extractedOrderId = rawPayload.resource?.id || rawPayload.id || "ORDER_HEALED_001";
  const extractedAmount = rawPayload.resource?.amount?.value || rawPayload.amount || "0.00";

  return {
    order_id: extractedOrderId,
    amount: extractedAmount,
    status: "HEALED_AND_CAPTURED"
  };
}

// 3. Webhook listener
export async function POST(req: Request) {
  try {
    const rawPayload = await req.json();

    try {
      // First try normal delivery
      const result = await sendToStore(rawPayload);
      return NextResponse.json({ success: true, healed: false, data: result });
    } catch (err: any) {
      // Caught error -> AI heals payload
      const fixedPayload = await healPayloadWithAI(rawPayload, err.message);

      // Replay healed payload
      const replayResult = await sendToStore(fixedPayload);

      return NextResponse.json({
        success: true,
        healed: true,
        original_error: err.message,
        repaired_payload: fixedPayload,
        result: replayResult
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}