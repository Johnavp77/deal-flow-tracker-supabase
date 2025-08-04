"use client";
export const dynamic = "force-dynamic";

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
type Deal = {
  id: string;
  name: string;
  stage: string | null;
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

  useEffect(() => {
    fetchDeals();
  }, [supabase]);

  async function fetchDeals() {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });

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
    await supabase.from("deals").insert({
      name,
      stage: "Lead",
      amount: 0,
      probability: 0,
      notes: null,
    });
    
    fetchDeals(); // refresh list
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

    <button
      className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      onClick={addDeal}
    >
      Add Deal
    </button>

    {deals.length === 0 ? (
      <p>No deals yet.</p>
    ) : (
      <ul className="space-y-2">
        {deals.map((d) => (
          <li key={d.id} className="border p-4 rounded">
            <strong>{d.name}</strong> – {d.stage}
          </li>
        ))}
      </ul>
    )}
  </div>
      ) : (
        <ul className="space-y-2">
          {deals.map((d) => (
            <li key={d.id} className="border p-4 rounded">
              <strong>{d.name}</strong> – {d.stage}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}