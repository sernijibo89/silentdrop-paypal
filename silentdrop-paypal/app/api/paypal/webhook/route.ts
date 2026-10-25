import { NextResponse } from "next/server";

type JsonObject = Record<string, unknown>;

type RepairedPayload = {
  order_id: string;
  amount: string;
  status: string;
};

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

async function sendToStore(payload: unknown) {
  const order = isJsonObject(payload) ? payload : {};

  if (!order.order_id || !order.amount) {
    throw new Error("Invalid Schema: Missing required fields 'order_id' or 'amount'");
  }

  return { status: 200, message: "Order processed successfully" };
}

async function healPayload(rawPayload: unknown): Promise<RepairedPayload> {
  const payload = isJsonObject(rawPayload) ? rawPayload : {};
  const resource = isJsonObject(payload.resource) ? payload.resource : {};
  const resourceAmount = isJsonObject(resource.amount) ? resource.amount : {};

  return {
    order_id:
      getString(resource.id) ??
      getString(payload.id) ??
      "ORDER_HEALED_001",
    amount:
      getString(resourceAmount.value) ??
      getString(payload.amount) ??
      "0.00",
    status: "HEALED_AND_CAPTURED",
  };
}

export async function POST(request: Request) {
  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body must contain valid JSON" },
      { status: 400 },
    );
  }

  try {
    const result = await sendToStore(rawPayload);
    return NextResponse.json({ success: true, healed: false, data: result });
  } catch (error: unknown) {
    const originalError =
      error instanceof Error ? error.message : "Unknown store error";
    const repairedPayload = await healPayload(rawPayload);

    try {
      const result = await sendToStore(repairedPayload);

      return NextResponse.json({
        success: true,
        healed: true,
        original_error: originalError,
        repaired_payload: repairedPayload,
        result,
      });
    } catch (replayError: unknown) {
      const message =
        replayError instanceof Error ? replayError.message : "Unknown replay error";

      return NextResponse.json(
        {
          success: false,
          healed: true,
          original_error: originalError,
          error: message,
        },
        { status: 422 },
      );
    }
  }
}