"use client";

import { useState } from "react";

type SimulationResult = {
  success: boolean;
  healed?: boolean;
  original_error?: string;
  repaired_payload?: {
    order_id: string;
    amount: string;
    status: string;
  };
  error?: string;
};

const samplePayload = {
  event_type: "PAYMENT.CAPTURE.COMPLETED",
  resource: {
    id: "PAYPAL_TX_98765",
    amount: { value: "49.99", currency_code: "USD" },
  },
};

export default function Home() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const simulateBrokenWebhook = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/paypal/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(samplePayload),
      });
      const data = (await response.json()) as SimulationResult;

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Webhook simulation failed.");
      }

      setResult(data);
    } catch (error: unknown) {
      setResult({
        success: false,
        error:
          error instanceof Error ? error.message : "Webhook simulation failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const wasRepaired = result?.success && result.healed;

  return (
    <main className="min-h-screen bg-[#f2f1eb] px-5 py-6 text-[#1c2923] sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-[#d8d8ce] pb-5">
          <a href="#top" className="flex items-center gap-3" aria-label="SilentDrop home">
            <span className="flex size-10 items-center justify-center bg-[#176b52] text-sm font-bold tracking-wide text-white">
              SD
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[0.08em]">SILENTDROP</span>
              <span className="block text-[10px] tracking-[0.16em] text-[#68746c]">PAYMENT RELIABILITY</span>
            </span>
          </a>
          <div className="flex items-center gap-2 text-xs font-medium text-[#59665e]">
            <span className="size-2 rounded-full bg-[#d28b38]" />
            SIMULATED ENVIRONMENT
          </div>
        </header>

        <section id="top" className="grid gap-6 py-10 sm:py-14 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[#176b52]">PAYPAL WEBHOOK LAB / 01</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl">
              Keep payment events moving.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#657168]">
              Send a nested capture event through the schema check, then inspect the repaired order payload.
            </p>
          </div>
          <div className="border-l-2 border-[#d28b38] pl-4 text-sm leading-6 text-[#59665e] md:max-w-52">
            <span className="block text-xs font-semibold tracking-[0.12em] text-[#1c2923]">DEMO MODE</span>
            No live PayPal transaction is created.
          </div>
        </section>

        <section className="grid border border-[#d8d8ce] bg-white md:grid-cols-2">
          <div className="min-w-0 border-b border-[#d8d8ce] p-5 sm:p-7 md:border-b-0 md:border-r">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#7b857e]">01 / INCOMING EVENT</p>
                <h2 className="mt-1 text-lg font-semibold">Raw PayPal payload</h2>
              </div>
              <span className="shrink-0 border border-[#d8d8ce] px-2 py-1 font-mono text-[10px] text-[#68746c]">JSON</span>
            </div>
            <pre className="overflow-x-auto bg-[#1c2923] p-5 text-xs leading-6 text-[#d9e6da] sm:text-[13px]">
              <code>{JSON.stringify(samplePayload, null, 2)}</code>
            </pre>
            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xs text-xs leading-5 text-[#7b857e]">
                The store expects top-level <code className="font-mono text-[#176b52]">order_id</code> and <code className="font-mono text-[#176b52]">amount</code> fields.
              </p>
              <button
                type="button"
                onClick={simulateBrokenWebhook}
                disabled={loading}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 bg-[#176b52] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#115740] disabled:cursor-wait disabled:bg-[#82998e]"
              >
                {loading ? "Processing event..." : "Run simulation"}
                <span aria-hidden="true">{loading ? "..." : "→"}</span>
              </button>
            </div>
          </div>

          <div className="min-w-0 p-5 sm:p-7" aria-live="polite">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#7b857e]">02 / DELIVERY TRACE</p>
                <h2 className="mt-1 text-lg font-semibold">Repair result</h2>
              </div>
              <span className={`shrink-0 border px-2 py-1 text-[10px] font-semibold tracking-[0.08em] ${result?.success ? "border-[#b8d7c5] bg-[#edf6f0] text-[#176b52]" : result ? "border-[#e5c2b7] bg-[#fbefeb] text-[#a44935]" : "border-[#d8d8ce] text-[#7b857e]"}`}>
                {loading ? "RUNNING" : result?.success ? "COMPLETE" : result ? "FAILED" : "READY"}
              </span>
            </div>

            {!result && !loading && (
              <div className="flex min-h-52 flex-col justify-center border-t border-[#e5e5dd] text-sm text-[#7b857e]">
                <span className="mb-3 text-2xl text-[#a8b2aa]">01 — 02</span>
                Run the simulation to see schema validation and replay details.
              </div>
            )}

            {loading && (
              <div className="flex min-h-52 items-center gap-3 border-t border-[#e5e5dd] text-sm text-[#59665e]">
                <span className="size-2 animate-pulse rounded-full bg-[#d28b38]" />
                Checking schema and replaying event...
              </div>
            )}

            {result && !result.success && (
              <div className="border-t border-[#e5e5dd] py-5 text-sm text-[#a44935]">
                <p className="font-semibold">Simulation could not complete</p>
                <p className="mt-2 break-words text-[#68746c]">{result.error}</p>
              </div>
            )}

            {result?.success && (
              <div className="border-t border-[#e5e5dd]">
                <div className="flex items-start gap-3 py-5">
                  <span className={`mt-1 size-2 shrink-0 rounded-full ${wasRepaired ? "bg-[#176b52]" : "bg-[#d28b38]"}`} />
                  <div>
                    <p className="font-semibold">{wasRepaired ? "Order rescued" : "Order accepted"}</p>
                    <p className="mt-1 text-sm leading-5 text-[#68746c]">
                      {wasRepaired ? "Schema repaired and payload replayed successfully." : "Payload passed the store schema check."}
                    </p>
                  </div>
                </div>
                {result.original_error && (
                  <p className="mb-4 border-l-2 border-[#d28b38] pl-3 text-xs leading-5 text-[#68746c]">
                    <span className="font-semibold text-[#1c2923]">Schema error:</span> {result.original_error}
                  </p>
                )}
                {result.repaired_payload && (
                  <>
                    <div className="mb-2 grid grid-cols-2 border-y border-[#e5e5dd] py-3 text-sm">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-[#7b857e]">ORDER ID</p>
                        <p className="mt-1 break-all font-mono text-xs">{result.repaired_payload.order_id}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.12em] text-[#7b857e]">AMOUNT</p>
                        <p className="mt-1 font-mono text-xs">${result.repaired_payload.amount} USD</p>
                      </div>
                    </div>
                    <pre className="overflow-x-auto bg-[#f2f1eb] p-4 text-xs leading-5 text-[#176b52]">
                      <code>{JSON.stringify(result.repaired_payload, null, 2)}</code>
                    </pre>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <footer className="flex flex-col gap-2 py-5 text-[11px] text-[#7b857e] sm:flex-row sm:items-center sm:justify-between">
          <span>SilentDrop / webhook schema recovery</span>
          <span>DEMO ONLY · NO PAYMENT CAPTURE</span>
        </footer>
      </div>
    </main>
  );
}
