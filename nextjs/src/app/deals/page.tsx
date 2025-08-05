"use client";
export const dynamic = "force-dynamic";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import clsx from "clsx";

type Stage = "Lead" | "Negotiation" | "Closed";

type Deal = {
  id: string;
  name: string;
  stage: Stage;
  amount: number | null;
  probability: number | null;
  notes: string | null;
  created_at: string;
};

export default function DealsPage() {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Stage | "All">("All");

  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function fetchDeals() {
    let query = supabase.from("deals").select("*").order("created_at", {
      ascending: false,
    });

    if (filter !== "All") {
      query = query.eq("stage", filter);
    }

    const { data, error } = await query;

    if (error) {
      setError(error.message);
    } else {
      setDeals(data as Deal[]);
    }
    setLoading(false);
  }

  async function addDeal() {
    const name = prompt("Deal name?");
    if (!name) return;

    const stageInput = prompt(
      'Stage? Type "Lead", "Negotiation", or "Closed" (default = Lead)'
    ) as Stage | null;
    const stage: Stage =
      stageInput === "Negotiation" || stageInput === "Closed"
        ? stageInput
        : "Lead";

    await supabase.from("deals").insert({
      name,
      stage,
      amount: 0,
      probability: 0,
      notes: null,
    });
    fetchDeals(); // refresh list
  }

  function nextStage(s: Stage): Stage {
    if (s === "Lead") return "Negotiation";
    if (s === "Negotiation") return "Closed";
    return "Closed";
  }

  async function advanceStage(id: string, current: Stage) {
    const newStage = nextStage(current);
    await supabase.from("deals").update({ stage: newStage }).eq("id", id);
    setDeals((prev) =>
      prev.map((d) => (d.id === id ? { ...d, stage: newStage } : d))
    );
  }

  function stageColor(s: Stage) {
    return clsx(
      "px-2 py-1 rounded text-xs font-semibold cursor-pointer",
      s === "Lead" && "bg-blue-100 text-blue-700 hover:bg-blue-200",
      s === "Negotiation" && "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      s === "Closed" && "bg-green-100 text-green-700"
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (loading) {
    return <div className="p-8">Loading…</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Deals</h1>

      {/* Add & Filter Controls */}
      <div className="flex items-center gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={addDeal}
        >
          + Add Deal
        </button>

        {/* Filter Tabs */}
        {(["All", "Lead", "Negotiation", "Closed"] as const).map((s) => (
          <button
            key={s}
            className={clsx(
              "px-3 py-1 rounded border",
              filter === s
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700"
            )}
            onClick={() => {
              setLoading(true);
              setFilter(s);
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Deal List */}
      {deals.length === 0 ? (
        <p>No deals yet.</p>
      ) : (
        <ul className="space-y-2">
          {deals.map((d) => (
            <li key={d.id} className="border p-4 rounded flex justify-between">
              <span>
                <strong>{d.name}</strong>
              </span>
              <span
                className={stageColor(d.stage)}
                onClick={() => advanceStage(d.id, d.stage)}
                title="Click to advance stage"
              >
                {d.stage}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
