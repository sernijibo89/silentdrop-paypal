"use client";

import { useState } from "react";

export default function Home() {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const simulateBrokenWebhook = async () => {
    setLoading(true);
    setLog(null);

    // Broken payload: store rejects this because fields are nested inside 'resource'
    const samplePayload = {
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      resource: {
        id: "PAYPAL_TX_98765",
        amount: { value: "49.99", currency_code: "USD" }
      }
    };

    const res = await fetch("/api/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(samplePayload)
    });

    const data = await res.json();
    setLog(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-2">SilentDrop for PayPal</h1>
        <p className="text-slate-400 mb-6">
          The smart robot guard that catches broken PayPal payment notes and repairs them automatically.
        </p>

        <button
          onClick={simulateBrokenWebhook}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          {loading ? "Processing..." : "Simulate Broken PayPal Webhook"}
        </button>

        {log && (
          <div className="mt-8 p-6 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-400">Order Rescued!</span>
            </div>

            <p className="text-sm text-red-400 mb-2">
              <strong>Error Caught:</strong> {log.original_error}
            </p>

            <p className="text-sm text-slate-300 mb-4">
              <strong>AI Status:</strong> Repaired schema and replayed successfully.
            </p>

            <pre className="bg-slate-950 p-4 rounded text-xs text-emerald-300 overflow-x-auto">
              {JSON.stringify(log.repaired_payload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}