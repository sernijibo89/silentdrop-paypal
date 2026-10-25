"use client";

import { useState } from "react";

export default function Home() {
  const [log, setLog] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rescuedCount, setRescuedCount] = useState(14);
  const [rescuedRevenue, setRescuedRevenue] = useState(699.86);

  const simulateBrokenWebhook = async () => {
    setLoading(true);
    setLog(null);

    const samplePayload = {
      event_type: "PAYMENT.CAPTURE.COMPLETED",
      resource: {
        id: `PAYPAL_TX_${Math.floor(10000 + Math.random() * 90000)}`,
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
    setRescuedCount((prev) => prev + 1);
    setRescuedRevenue((prev) => +(prev + 49.99).toFixed(2));
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
                Guard Active &amp; Listening
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">SilentDrop for PayPal</h1>
            <p className="text-sm text-slate-400 mt-1">
              Autonomous agentic middleware repairing dropped payment webhooks in real time.
            </p>
          </div>

          <button
            onClick={simulateBrokenWebhook}
            disabled={loading}
            className="self-start md:self-auto bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-medium py-2.5 px-5 rounded-lg shadow-lg shadow-blue-500/20 transition-all text-sm"
          >
            {loading ? "Repairing..." : "Simulate Broken Webhook"}
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400">Total Events Monitored</p>
            <p className="text-2xl font-bold text-white mt-1">1,262</p>
            <p className="text-xs text-slate-500 mt-1">PayPal sandbox stream</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400">Silent Drops Caught</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{rescuedCount}</p>
            <p className="text-xs text-emerald-400 mt-1">100% auto-repaired</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-400">Revenue Rescued</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">${rescuedRevenue}</p>
            <p className="text-xs text-slate-500 mt-1">Zero manual re-entry</p>
          </div>
        </div>

        {/* Real-time Rescue Terminal */}
        {log && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-slate-850 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">Agent Execution Trace</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Resolved in 18ms
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 font-mono font-medium border border-red-500/20">
                  REJECTED
                </span>
                <div>
                  <p className="text-slate-300 font-medium">Store Endpoint Returned 400</p>
                  <p className="text-red-400/90 font-mono mt-0.5">{log.original_error}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono font-medium border border-blue-500/20">
                  AI HEALER
                </span>
                <div>
                  <p className="text-slate-300 font-medium">Schema Normalized &amp; Validated</p>
                  <p className="text-slate-400 mt-0.5">Extracted payload parameters into required flat structure.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono font-medium border border-emerald-500/20">
                  REPLAYED
                </span>
                <div>
                  <p className="text-slate-300 font-medium">Delivered Successfully (200 OK)</p>
                  <p className="text-emerald-400/90 font-mono mt-0.5">Order confirmed and marked as fulfilled.</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-slate-400 mb-1.5">Repaired Payload:</p>
                <pre className="bg-slate-950 p-3.5 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800/80">
                  {JSON.stringify(log.repaired_payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}