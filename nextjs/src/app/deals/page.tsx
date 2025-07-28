"use client";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DealsPage() {
  const [session, setSession] = useState<any | null>(null);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  useEffect(() => {
    if (session) fetchDeals();
  }, [session]);

  async function fetchDeals() {
    const { data } = await supabase
      .from("deals")
      .select("*")
      .order("created_at", { ascending: false });
    setDeals(data || []);
  }

  async function addDeal() {
    const name = prompt("Deal name?");
    if (!name) return;
    await supabase.from("deals").insert({ name, stage: "Lead", amount: 0, probability: 0 });
    fetchDeals();
  }

  async function downloadCSV() {
    const { data } = await supabase.from("deals").select("*");
    if (!data || data.length === 0) {
      alert("No deals to export.");
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map((row) =>
      headers
        .map((h) => {
          const val = (row as any)[h] ?? "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "deals.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (!session) {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Deal Flow Tracker</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            const email = prompt("Email address?");
            if (email) supabase.auth.signInWithOtp({ email });
          }}
        >
          Sign in / Sign up
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Deals</h1>
      <div className="mb-4 space-x-2">
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={addDeal}>
          + Add Deal
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={downloadCSV}>
          Export CSV
        </button>
      </div>
      <ul className="space-y-2">
        {deals.map((d) => (
          <li key={d.id} className="border p-4 rounded">
            <strong>{d.name}</strong> – {d.stage}
          </li>
        ))}
      </ul>
      <button className="mt-8 text-red-500" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </div>
  );
}
