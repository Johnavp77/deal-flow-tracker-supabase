"use client";
Skip to content
Navigation Menu
Johnavp77
deal-flow-tracker-supabase

Type / to search
Code
Pull requests
Actions
Projects
Wiki
Security
Insights
Settings
Files
Go to file
.github
FUNDING.yml
page.tsx
.idea
inspectionProfiles
Project_Default.xml
.gitignore
modules.xml
supabase-nextjs-template.iml
vcs.xml
nextjs
.idea
inspectionProfiles
.gitignore
modules.xml
nextjs.iml
vcs.xml
public
terms
privacy-notice.md
refund-policy.md
terms-of-service.md
file.svg
globe.svg
next.svg
vercel.svg
window.svg
src
app
api/auth/callback
route.ts
app
storage
table
user-settings
page.tsx
layout.tsx
page.tsx
auth
2fa
page.tsx
forgot-password
login
register
reset-password
verify-email
layout.tsx
deals
page.tsx
page.tsx.rtf
legal
[document]
layout.tsx
page.tsx
favicon.ico
globals.css
layout.tsx
page.tsx
components
ui
alert-dialog.tsx
alert.tsx
button.tsx
card.tsx
dialog.tsx
input.tsx
textarea.tsx
AppLayout.tsx
AuthAwareButtons.tsx
Confetti.tsx
Cookies.tsx
HomePricing.tsx
LegalDocument.tsx
LegalDocuments.tsx
MFASetup.tsx
MFAVerification.tsx
SSOButtons.tsx
lib
context
supabase
pricing.ts
types.ts
utils.ts
middleware.ts
.env.template
.gitignore
README.md
components.json
eslint.config.mjs
next.config.js
next.config.ts
package-lock.json
package.json
postcss.config.mjs
tailwind.config.ts
tsconfig.json
yarn.lock
supabase
migrations
20250107210416_MFA.sql
20250130165844_example_storage.sql
20250130181110_storage_policies.sql
20250130181641_todo_list.sql
migrations_for_old
20250107210416_MFA.sql
20250130165844_example_storage.sql
20250130181110_storage_policies.sql
20250130181641_todo_list.sql
20250525183944_auth_removal.sql
.gitignore
config.toml
LICENSE
README.md
page.tsx.rtf.dff
deal-flow-tracker-supabase/nextjs/src/app/deals
/
page.tsx
in
main

Edit

Preview
Indent mode

Spaces
Indent size

2
Line wrap mode

No wrap
Editing page.tsx file contents
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
est"use client";
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

    fetchDeals();
  }, [supabase]);

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
  );
}

Use Control + Shift + m to toggle the tab key moving focus. Alternatively, use esc then tab to move to the next interactive element on the page.
New File at nextjs/src/app/deals · Johnavp77/deal-flow-tracker-supabaseexport const dynamic = "force-dynamic";

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
