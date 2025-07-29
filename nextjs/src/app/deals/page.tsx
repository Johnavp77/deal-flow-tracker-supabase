"use client";
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

export default function DealsPage() {
  const [supabase] = useState(() =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    )
  );

  return <div>App is loading…</div>;
}
// test
