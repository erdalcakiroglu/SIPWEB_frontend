# Cloudflare Deployment Operations

This document describes the current Cloudflare deployment model for the public SQL Performance Intelligence website and records the operational decisions that should be preserved for future releases.

## Current Production Topology

As of **August 15, 2026** (verified against the Cloudflare API), the production website uses the following Cloudflare resources:

- **Worker name:** `dbperfstudio-website`
- **Canonical host:** `sqlperformance.ai` — attached as a Workers **Custom Domain**, not a zone route
- **Zone route:** `www.sqlperformance.ai/*`
- **www handling:** a zone-level Redirect Rule answers `www` with `301 -> https://sqlperformance.ai/`. Redirect Rules run *before* Workers, so the `www` route never actually executes the Worker; it is kept attached only as a fallback if that rule is ever removed.
- **Zone:** `sqlperformance.ai` (zone id `db7f540f1044cf14beb6fa284c284aee`)
- **Worker entrypoint:** `.open-next/worker.js`
- **Static asset binding:** `ASSETS -> .open-next/assets`
- **Self-service binding:** `WORKER_SELF_REFERENCE -> dbperfstudio-website`
- **Incremental cache bucket:** `NEXT_INC_CACHE_R2_BUCKET -> dbperfstudio-website-opennext-cache`
- **Images binding:** `IMAGES`
- **Observability:** enabled

The current Wrangler config is defined in [`wrangler.jsonc`](../wrangler.jsonc).

### Apex must stay declared as a Custom Domain

Until August 15, 2026 `wrangler.jsonc` listed **only** the `www` route while production actually served the apex.

How dangerous that was depends on a distinction worth recording: `wrangler deploy` **replaces** a Worker's zone routes with whatever the config declares, but it appears to leave **Custom Domains** it does not know about alone. The July 15, 2026 production deploy shipped from a config with no apex entry and the apex Custom Domain survived it. So this was config drift and a landmine for anyone reasoning about the file, not an imminent outage — but a hostname declared as a plain route in this position genuinely would have been dropped.

The apex is now declared explicitly:

```jsonc
"routes": [
  { "pattern": "sqlperformance.ai", "custom_domain": true },
  { "pattern": "www.sqlperformance.ai/*", "zone_name": "sqlperformance.ai" }
]
```

The `custom_domain: true` form is required. Declaring the apex as a plain `zone_name` route instead would fail the deploy with a "uri already in use" style conflict, because a Custom Domain already owns that hostname.

### Do not put comments in `wrangler.jsonc`

Despite the `.jsonc` extension, keep the file comment-free. `npm run deploy:cf` shells out to `powershell` (Windows PowerShell 5.1), whose `ConvertFrom-Json` rejects JSON comments — a single `//` line makes the deploy wrapper fail before it builds anything. Document configuration decisions here instead.

## Important Decision

The active production Worker is **only** `dbperfstudio-website`.

The temporary Worker `sipweb-frontend` was removed on **May 30, 2026** and should not be recreated unless there is a deliberate migration plan. During earlier troubleshooting, route confusion between `dbperfstudio-website` and `sipweb-frontend` caused avoidable deployment mistakes.

## Build and Deploy Commands

The site is a Next.js application deployed through OpenNext for Cloudflare.

Relevant scripts from [`package.json`](../package.json):

```json
"build": "next build",
"preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
"deploy:cf": "powershell -ExecutionPolicy Bypass -File .\\scripts\\deploy-cloudflare.ps1",
"upload": "opennextjs-cloudflare build && opennextjs-cloudflare upload"
```

The recommended operator entrypoint is now:

```powershell
npm run deploy:cf
```

That wrapper script validates the Worker name, route, and build mode before deployment, then runs a basic production smoke check after deploy.

### Required Rule

Use **webpack** builds for Cloudflare deployment. Do **not** switch the production build to Turbopack server output without revalidating OpenNext runtime compatibility.

On this project that rule is satisfied by plain `next build`, and adding `--webpack` would break the build.

This was ambiguous until August 15, 2026, when it was resolved against the toolchain rather than by preference. The project is on **Next 15.5.18** ([`package.json`](../package.json)), where webpack is the *default* builder and Turbopack is the opt-in. `npx next build --help` on this version lists `--turbopack` / `--turbo` and **no `--webpack` flag at all** — that flag only exists on Next 16, where the defaults are inverted. So:

- `next build` → webpack. This is what the rule asks for.
- `next build --webpack` → unknown option, the build fails before it starts.

An earlier revision of this document recorded the command as `next build --webpack`. That was carried over from a Next 16 context and never applied here. [`package.json`](../package.json) and [`deploy-cloudflare.ps1`](../scripts/deploy-cloudflare.ps1) both say `next build`, and the production deploy on July 15, 2026 (version `98924ee8-0183-4319-9dfb-06930ed1f20e`) shipped from exactly that and serves correctly.

If the project is ever upgraded to Next 16, this flips: `--webpack` becomes required, and both `package.json` and the assertion in `deploy-cloudflare.ps1` must be updated together.

## Standard Release Flow

Run all commands from:

```powershell
C:\Users\erdal.cakiroglu\PycharmProjects\SPStudioProWeb-v2.3\SIPWeb\web
```

### 1. Local validation

```powershell
npm run lint
npm run preview
```

Then verify:

- `http://127.0.0.1:8787/`
- `http://127.0.0.1:8787/docs/installation`
- `http://127.0.0.1:8787/docs/quickstart`

### 2. Production deploy

```powershell
npm run deploy:cf
```

### 3. Production smoke check

Verify the following URLs immediately after deploy:

- `https://sqlperformance.ai/`
- `https://sqlperformance.ai/docs`
- `https://sqlperformance.ai/docs/installation`
- `https://sqlperformance.ai/docs/quickstart`

Also verify the canonical redirect still holds:

- `https://www.sqlperformance.ai/` must answer **301** with `Location: https://sqlperformance.ai/`

`deploy:cf` now performs both checks automatically. The redirect assertion matters for SEO: the site spent its first 90 days with `www` and non-`www` both indexed, which split authority across 20 duplicate paths. If that redirect regresses, the duplication comes back.

Also verify that image popup behavior, mobile navigation, and static assets still load correctly.

## Current Known-Good Production Version

As of **October 8, 2026**, the latest confirmed production deployment is:

- **Worker:** `dbperfstudio-website`
- **Version ID:** `0e334b8c-8f4f-4567-bce4-ecf4918b2d8a` (deployed October 8, 2026, serving 100% of traffic — legal pages: the Privacy Policy now covers website hosting, the contact form, the customer portal, payments, what the desktop app sends to the license server (email, a locally computed device hash, Windows version, license token), the Microsoft SQL Server update list and the optional webhook, and states there is no telemetry, usage analytics, crash reporting or update check; the Cookie Policy says the consent choice is kept in localStorage and `_ga` cookies are set only after Accept; the Analytics Disclosure describes Consent Mode cookieless signals before a choice; the consent code now grants `analytics_storage` only on Accept and keeps `ad_storage`, `ad_user_data` and `ad_personalization` denied in every case, the banner no longer says "by continuing you accept", and its buttons are Accept and Reject; sitemap lastmod for /privacy, /cookie-policy and /analytics-disclosure set to 2026-10-08; git commit `cebd038`). Verified in the local preview (Reject stores `denied` and sets no `_ga` cookie; Accept sets only `_ga` and `_ga_*` with ad signals denied) and by hand with curl: the three pages return the new text, the live layout bundle has the Accept and Reject labels, and the sitemap shows the new lastmods.
- **Previous version:** `e23decde-1fbe-4605-a3ac-ff14fd11894f` (deployed October 8, 2026 — FAQ re-checked against the v1.1.0 app: the module list uses the sidebar labels (Overview, Blocking, Jobs, Security) and names the export formats, the first steps say to confirm the server and database in the top bar and open Overview, an offline trial is described as registered at the next start or license refresh, and the troubleshooting answers name the Query Store Health notice and the provider dialog's Test button; the docs index no longer mentions an LLM selector in the top bar; sitemap lastmod for /docs set to 2026-10-08; git commit `c550719`). Verified by hand with curl: `/faq` and `/docs` return the new text (the first `/faq` request after the deploy still returned the cached old page; the next one was fresh) and the sitemap shows the new lastmods. This is the rollback target if the legal pages change must be pulled.
- **Earlier version:** `9ffd5862-5521-4301-8cdf-64e01ff00e1a` (deployed October 8, 2026 — download page: the Installation Guide link now points to `/docs/installation` instead of `/docs`, the missing-hash fallback no longer shows developer instructions, and the unsigned-installer note explains the Edge "Keep" and SmartScreen "More info, then Run anyway" steps and asks to compare the SHA-256 hash first; sitemap lastmod for /download set to 2026-10-08; git commit `710b01e`). Verified by hand with curl: `/download` returns the new text and the `/docs/installation` link, `/docs/installation` returns 200, and the sitemap shows the new lastmod.
- **Older version:** `37821f75-9f0c-48c6-bf19-20187f40db7d` (deployed October 8, 2026 — pricing: plan cards, pricing hero/meta and the FAQ license answer now say a license activates on one device with no SQL Server limit (was per user); Team lost "Priority email support" and the portal line lists what the portal does; Enterprise extras without code behind them are "available on request" and the offline .lic item is gone; `/security` no longer calls the offline license file "signed"; sitemap lastmod for /pricing, /faq and /security set to 2026-10-08; git commit `59748e6`). Verified by hand with curl: all three pages return 200 with the new text and the sitemap shows the new lastmods.
- **Home image version:** `268a99e2-1466-4e5f-99fc-594f28541ca5` (deployed October 8, 2026 — home page hero image replaced with the owner's new full-window v1.1.0 Overview screenshot (`public/main/home-overview.png`, Windows title bar cropped off, 1919×1011); `public/docs/dashboard/003.png` stays as the docs and use-case image; git commit `1f8ab08`). The first deploy attempt failed with EPERM on `.open-next` while the local dev server was running; it succeeded after the dev server was stopped. Verified by hand with curl: `/main/home-overview.png` returns 200 and the home page HTML references it instead of the old image.
- **Use cases version:** `c7cc9fbc-afb2-4bd5-8cdb-7d973b3700aa` (deployed October 8, 2026 — use cases: the three cases with invented measurements (blocking storm, plan regression, PAGEIOLATCH) are now labeled example scenarios with no invented numbers, v1.1.0 module labels, current demo-database screenshots and a What to Verify section instead of before/after metrics; the non-SARGable procedure case had its captions and alt texts re-checked against the June 26 report files, its report images renamed and the old brand bar cropped off; the index page no longer says "real problems" or "measured outcome"; sitemap lastmod for the five use-case URLs set to 2026-10-08; git commit `9aec148`). Verified by hand with curl: all five pages return 200 with the new text, the four new case images return 200, the four old image paths return 404, and the sitemap shows the new lastmods.
- **Cleanup version:** `8510f5a1-c3f1-4333-a952-bb4f72abf22b` (deployed October 8, 2026 — removed the unused `components/AIShowcase.tsx` (imported by no page) and its image `public/main/0006a-AI_Report-01.png`, which showed the former product name; git commit `2349126`). Verified by hand with curl: the old image path returns 404, the home page, its new report image and `/docs` return 200.
- **Home page version:** `27045e85-d404-47df-8171-49e06fe0c7d1` (deployed October 8, 2026 — home page re-verified against v1.1.0: Hero and TrustBar say AI defaults to the user's own local Ollama host (Ollama is not bundled), the "Built for review" section shows a v1.1.0 Save Report export (`public/main/home-ai-report-query-analysis.png`) instead of the June capture with the former product name, confidence is described as report-level, sitemap lastmod for `/` set to 2026-10-08; git commit `fd75feb`). Verified by hand with curl: the home page contains the new Hero and TrustBar text and the new image path, the image returns 200 (`image/png`, 94 KB), and the sitemap shows the new lastmod.
- **Installation version:** `f1147337-6a24-4baa-98b3-1ec86bf101a6` (deployed October 8, 2026 — Installation page "Trial not available" item now describes the "Trial Not Started" warning of the rebuilt 1.1.0 MSI (released 2026-10-08, SHA-256 `a0e3a76b…`), `release.json` fallback moved to that release, sitemap lastmod for `/docs/installation` set to 2026-10-08; git commit `e2a28ad`). Verified by hand with curl: the installation page contains the new text, the download page shows 2026-10-08 and the new hash, the sitemap shows the new lastmod, and the installer route returns 200 with `filename="SQLPerformance AI-1.1.0.msi"`.
- **Download page version:** `54606c79-df12-44ec-bef9-7afcc589841d` (deployed October 8, 2026 — download page points at the stable installer route `https://downloads.sqlperformance.ai/SQLPerformance-AI.msi`, the certUtil command uses the versioned file name `SQLPerformance AI-<version>.msi`, the `release.json` fallback is 1.1.0 / 2026-10-04, `scripts/compute-sha256.js` looks for the new file name, and the Scheduled Jobs page describes the permission hint without quoting it; git commit `0a193f1`). Deployed right after the API worker `sqlperformance-api` version `6919de74-eb88-472f-af42-ac281cd91836` (previous `8fcc5d3c`), which serves that route from R2 key `SQLPerformance AI-<version>.msi` and 301s the old `/SQL-Performance-Intelligence.msi`. Verified by hand with curl: license 200, portal and admin 302 as before, the old MSI URL 301s to the new one, the new one returns 200 with `filename="SQLPerformance AI-1.1.0.msi"` and 35,868,672 bytes (the local 1.1.0 MSI size), and the live download page shows the new link and command.
- **Getting Started version:** `c66bfdc5-a57f-4ae7-ab04-05e7cad6effb` (deployed October 8, 2026 — Getting Started pages rewritten against the v1.1.0 app: Overview (main-window capture, prerequisites, where AI is used, what leaves the machine), Installation (requirements, MSI behaviour, first-run license/profile/trial as text, Add Connection capture with server and username blurred, Add AI Model capture, licensing, per-module permissions with the full msdb grant list, Query Store prep, data locations) and Quickstart (new captures, no top-bar LLM selector); eight old-UI installation PNGs removed; `/docs` silent-install example made generic; overview and dashboard summaries and sitemap lastmod updated; git commit `072b2cf`). The first `npm run deploy:cf` attempt failed while populating the R2 incremental cache (`Failed to populate remote R2 bucket "dbperfstudio-website-opennext-cache"`, repeated R2 worker timeouts) and nothing was published; a plain retry succeeded. Verified by hand with curl: the three pages return 200 with the new content, the three new PNGs return 200 at their local sizes, a removed PNG returns 404, sitemap lastmod is 2026-10-07, www still 301s. A request made before the deploy had left a cached 404 for `/docs/overview/001.png` at the edge; it revalidated to 200 within minutes.
- **Headers version:** `6f7fcd9a-3bb8-4b24-9390-a30b045ff7f2` (deployed October 7, 2026 — `public/_headers` noindex prefix for the Index Advisor sample reports changed from the pre-rebrand `AI_Analysis_*` to the current `index_advisor_ai_analysis_*`; since the rebrand (`4d7c395`) the extensionless 200 of those three reports had gone out without `X-Robots-Tag`; git commit `b31571b`). Verified by hand with curl: all three extensionless report URLs return 200 with `x-robots-tag: noindex, nofollow, noarchive`, and the `.html` URLs 307 to them.
- **Index Advisor version:** `8588afd6-0c8c-41a4-8d33-0ad4ebbbabb8` (deployed October 7, 2026 — Index Advisor docs page rewritten against the v1.1.0 module with six new screenshots (workspace, Index Details overview, narrowed list, action script, AI dock, Decision Cockpit), facts re-verified in app code; `/security` Index Advisor card and the FAQ masking answer corrected to the default name masking; sitemap lastmod bumped for both pages; git commit `3381626`). The deploy script printed no smoke output on this run; the page, the six PNGs, the Security and FAQ text, and the sitemap lastmod were verified by hand with curl.
- **Security card version:** `325d3de7-05b7-4f56-9ff0-24e9bd748cdb` (deployed October 7, 2026 — `/security` Object Explorer card corrected to the implemented data guard (credential values in source masked, definitions over 200,000 characters cut, the unsupported 80-character parameter clip removed); git commit `e421213`). The deploy script's smoke check passed; `/security` was also verified by hand with curl (200, new text present, old text gone).
- **Object Explorer version:** `390d3aeb-0d33-44bd-8690-b891fa2bfa39` (deployed October 7, 2026 — Object Explorer docs page rewritten against the v1.1.0 module with seven new screenshots (layout, Statistics, Relations key diagram and code dependency map, AI Tune running and completed, Batch queue), facts re-verified in app code, sitemap lastmod bumped; git commit `c23eab4`). The deploy script's smoke check passed on this run; the page, the seven PNGs, both example AI reports (307 to the extensionless URL with `x-robots-tag: noindex, nofollow, noarchive`), and the sitemap lastmod were also verified by hand with curl.
- **Wait Statistics version:** `f0113261-1959-44df-871a-d5db2a48d5ea` (deployed October 7, 2026 — Wait Statistics docs page revisited against the v1.1.0 module with five new screenshots and a new sample report, stale Automation/outbound controls removed, guide health-line sentence corrected, sitemap lastmod bumped; git commit `01a515c`). The deploy script's smoke check passed on this run; the page, the five PNGs, the report (307 to the extensionless URL with `x-robots-tag: noindex, nofollow, noarchive`), the 404 of the retired 2026-10-04 report, and the sitemap lastmod were also verified by hand with curl.
- **Hero version:** `97383bb8-6c5b-4ded-8081-5d36f682e505` (deployed October 7, 2026 — home page Hero switched from the pre-rebrand Dashboard capture to the v1.1.0 Dashboard Overview screenshot already used on the Dashboard docs page, and `public/docs/dashboard/001.png` removed; git commit `41209ac`). The deploy script's final smoke check timed out on this run (`TaskCanceledException`), so the production URLs were verified by hand with curl instead: home page 200 with the new Hero image, `/docs/dashboard/003.png` 200, `/docs/dashboard/001.png` 404 as intended.
- **Query Statistics version:** `de3f2dc2-7ee9-4d21-afbe-0ca3ded7f799` (deployed October 7, 2026 — Query Statistics docs page revisited against the v1.1.0 module with the plan selector, batch operations, and six new screenshots; git commit `35078fa`).
- **Dashboard version:** `31992811-687a-4aa3-a1ef-2b42063d3663` (deployed October 7, 2026 — Dashboard docs page rewritten against the v1.1.0 Overview screen with five new screenshots and the sanitized Configuration Audit sample report; git commit `c4d75ce`).
- **Scheduled Jobs version:** `bba1a8a5-51d7-44d6-bc04-24536cf83057` (deployed October 7, 2026 — Scheduled Jobs docs page rewritten against the v1.1.0 Jobs module with seven screenshots; git commit `37216d1`).
- **Security Audit captions version:** `361e74a2-3b09-4a89-aa39-cde406bc6d3a` (deployed October 7, 2026 — Security Audit screenshot captions restructured into a lead sentence plus a bulleted list; git commit `34ea138`).
- **Security Audit version:** `2b59b76c-c486-4c84-b157-7574fbaf5b85` (deployed October 7, 2026 — Security Audit docs page gained the v1.1.0 screenshot set and the sanitized sample HTML report; git commit `87c71a4`).
- **Rebrand version:** `0bbcd788-0992-41ee-b00e-faf993209947` (deployed October 7, 2026 — product renamed to SQLPerformance AI, docs pages realigned with the v1.1.0 desktop app, Blocking Analysis screenshot set added; git commit `4d7c395`). Roll back to it only if the Security Audit assets must be pulled as well.
- **Pre-rebrand version:** `95f41276-f54c-4cf7-96d2-04af449c4346` (deployed August 15, 2026 — wait statistics docs page rescoped to the module so it stops competing with the guide). Use it only if the October rebrand must be reverted wholesale.

> **When a guide ships, the docs page on the same subject has to give way.**
> `/docs/modules/wait-statistics` was retitled "SQL Server Wait Statistics —
> Wait Types Explained" earlier the same day, which was correct while it was the
> only page we had on the subject. Publishing
> `/guides/sql-server-wait-statistics` made it wrong: two pages, roughly 9,200
> words between them, with titles opening on the same phrase, competing for
> `sql server wait stats` on a domain three months old with almost no authority.
> That splits one weak signal instead of concentrating it — the content-level
> version of serving the site on both www and non-www.
>
> The rule to apply next time, before the second page goes live rather than
> after: **pick the winner, and scope the loser back.** The guide wins, because
> it is vendor-neutral and is therefore the page that can attract links and be
> shared. The docs page keeps every word of its body — depth costs nothing once
> the titles are no longer competing — but its `h1` is now "Wait Statistics
> Module" and its `<title>` "Wait Statistics Module — SQL Performance
> Intelligence" (53 chars), and its meta description describes the module rather
> than the subject. A blue panel is now the first element on the docs page,
> above the overview prose, pointing at the guide, so the linking is
> bidirectional (docs → guide ×3, guide → docs ×1) and the hierarchy is
> unambiguous. **Canonicals stay self-referencing on both** — these are two
> genuinely different pages, not duplicates, and cross-canonicalising them would
> throw away the docs page entirely.

> **Two guides on adjacent subjects need a stated division of labour.** The
> diagnosis guide and the wait statistics guide could easily have become the same
> page written twice. What keeps them apart is a rule worth repeating when the
> third guide arrives: the diagnosis guide owns the *method* — define the
> symptom, scope it, triage, branch, narrow, prove — and it deliberately keeps
> each branch shallow, handing off to a deeper page where one exists. The wait
> statistics guide owns one of those branches in full. Neither repeats the
> other's T-SQL: the diagnosis guide's ten code blocks are triage, blocking-chain
> recursion, the scheduler-monitor ring buffer, plan-cache CPU and elapsed
> ranking, memory clerks and grants, virtual file stats, tempdb space usage, the
> Query Store regression comparison, and a measurement harness — none of which
> appear in the wait guide, and none of which are wait DMV queries. The FAQ sets
> share no question either. Verified live August 15, 2026: `<title>` 47 chars,
> `headline` equal to the visible `<h1>`, no `about` node, 5544 words, 15/15
> in-page anchors, all 10 outbound internal links returning 200, responsive sweep
> 132/132 clean across 33 routes.

> **`/guides` is about SQL Server; `/docs` is about the product.** The split is
> deliberate and it is the thing to preserve when adding the next guide. A docs
> page describes a screen: what the buttons do, what the columns mean, where the
> data comes from. A guide is useful to someone who will never install anything —
> runnable T-SQL, DMV reference, methodology — and its subject is SQL Server, not
> us. Three consequences are wired into the code. `TechArticleSchema` grew an
> `aboutProduct` prop, default `true`; the guides pass `false`, because the
> `about: {'@id': '/#software'}` claim would be a small lie in the structured data
> and would blur exactly the topical separation the guides exist to create. The
> two pages on one subject must not answer the same questions — the wait
> statistics docs page owns the module plus a compact wait-type table, the guide
> owns the queries, delta capture, Query Store attribution and the cause /
> confirm / fix playbooks, and their FAQ blocks share no question. And the guides
> link is in the **footer**, not the header nav: the header needs about 1000px for
> six links and only just fits at `lg`, so a seventh would break it again.
> Sitemap priority is 0.9 for a guide (same as a commercial page) and 0.8 for the
> index. Verified live August 15, 2026: `<title>` 46 chars, `headline` equal to
> the visible `<h1>`, no `about` node, 4064 words, 12/12 in-page anchors
> resolving, and the responsive sweep re-run at 128/128 clean across 32 routes.

> **A docs page can carry its own `h1` and `<title>`.** `DocsPage` in
> `app/docs/data.ts` now takes optional `h1` and `metaTitle`. The module name is
> what belongs in the sidebar and the breadcrumb, where a descriptive heading
> would wrap badly; it is not necessarily what people search for. Wait Statistics
> is the first user: the tab inside the product is called "Wait Statistics", the
> page heading is "Wait Statistics Module". (That heading was briefly "SQL Server
> Wait Statistics" — see the note above on why it was scoped back the same day.)
> Two rules when adding another one. The `TechArticleSchema` `headline` is wired to the same resolved value as
> the visible `<h1>` in `module_page.tsx` — never set them separately, because
> Google treats structured data that does not appear on the page as a violation.
> And `metaTitle` is a *complete* override, not a prefix: the default pattern
> appends "— Modules — Docs — SQL Performance Intelligence™", which runs to 65
> characters before the page name is even counted, so on a page written to answer
> an informational query the brand is what gets truncated away anyway.

> **`sameAs` takes organization profiles, not personal ones.** The property tells
> Google which other profiles are the *same entity* as the Organization node, and
> it feeds the Knowledge Panel. The GitHub account (`sqlperformanceai`, verified
> 200 / user id 317333740 on August 15, 2026) qualifies; the LinkedIn URL in the
> footer is a personal profile and is deliberately left out of `sameAs` while
> still carrying `rel="me"` as a link. LinkedIn answers automated requests with
> HTTP 999 whether or not a profile exists, so footer social URLs cannot be
> smoke-checked from CI — verify them in a browser.

> **`min-width: auto` is why phones scrolled sideways.** Every grid and flex item
> starts at `min-width: auto`, so it refuses to shrink below its content's
> intrinsic minimum. One `<pre>` with a long command line, or one identifier like
> `sys.query_store_runtime_stats_interval`, was enough to widen a whole column and
> drag the page into horizontal scroll — the worst case measured 766px inside a
> 390px viewport. The `<pre>`'s own `overflow-x: auto` never engaged because
> nothing constrained it. Fixes, applied August 15, 2026: `min-w-0` on the docs,
> use-case and security grid/flex children, and `overflow-wrap: anywhere` on
> `.font-mono` in `globals.css`. Note that Tailwind's `break-words`
> (`overflow-wrap: break-word`) does *not* solve this on its own — it wraps the
> word but leaves min-content width unchanged; only `anywhere` reduces it.
> Verified with Playwright across all 30 sitemap routes at 360, 390, 820 and
> 1180px: 120/120 clean.

> **Header breakpoint is `lg`, not `md`.** The six nav links plus the wordmark and
> the CTA need roughly 1000px. At `md` (768px) they were still rendered, so on an
> iPad in portrait "Use Cases" and "Start Trial" each wrapped onto two lines and
> overlapped. Three classes in `components/Header.tsx` must stay in step: the
> desktop `<nav>` (`hidden lg:flex`), the toggle button (`lg:hidden`) and the
> mobile `<nav>` (`lg:hidden`).

> **Static assets drop the `.html` extension.** Cloudflare's asset router serves
> `public/foo.html` at `/foo` and 307s `/foo.html` to it. Two consequences bit us
> on August 15, 2026: rules keyed on `.html` in `next.config.js` and `_headers`
> only ever tagged the *redirect*, so the 200 that Google indexes carried no
> `X-Robots-Tag`; and every in-page link written with `.html` cost readers an
> extra round trip. Match asset rules by filename prefix, not extension, and link
> to the extension-less path. Verify with `curl -sI` against the **final** URL —
> `curl -sIL` prints both responses and it is easy to read the redirect's headers
> and assume they applied to the page.

Previous recorded versions: `3c5bc87c-b406-44bf-b11e-eb4611c5829d` (August 15, 2026 — second pillar guide, `/guides/diagnose-sql-server-performance-problems`), `f7acd089-7898-4f3c-ac8a-ef3fbb50779f` (August 15, 2026 — `/guides` section added with the wait statistics pillar guide), `25bbdb0b-adae-4065-8ed5-71692328afae` (August 15, 2026 — `/docs/modules/wait-statistics` rewritten as a subject-matter page, `h1` / `metaTitle` overrides added to `DocsPage`), `3ad0369d-a64f-4278-8a76-16e35699c4b1` (August 15, 2026 — GitHub and LinkedIn icons in the footer, GitHub added to `Organization.sameAs`), `1489be83-34b4-4d6e-bb34-89c6c6c633f5` and `3d84963b-07dd-4c7e-b5ad-9204d8102e42` (August 15, 2026 — header switches to the hamburger at lg, docs sidebar gets a two-column layout on tablets, module pages get the collapsible docs menu on phones), `2f55806b-e3c7-4a96-b4fd-852cd5b6bb74` (August 15, 2026 — last horizontal-scroll residual, flex child on the use-case step list), `50376466-1b9a-494d-b460-1efebe54200b` (August 15, 2026 — use-case pages `min-w-0`, `.font-mono` wraps anywhere), `2cb7eff1-145c-4d12-8877-9201e4a955b5` (August 15, 2026 — docs and security grid children `min-w-0`), `f2c26613-a22c-44c6-a0c3-3bc2d1a1620e` (August 15, 2026 — footer link, /pricing sitemap entry, working noindex on sample reports), `af06d250-476d-48df-bcd9-dcf177f985ed` (August 15, 2026 — TechArticle schema on all 12 docs pages), `5acc7003-a4ae-4887-84b4-84f1da8b1584` (August 15, 2026 — homepage H1 names SQL Server performance, 256px logo), `b81ab541-d8ed-4ea2-afe4-670c87524c67` (August 15, 2026 — contact address moved off the unregistered dbperfstudio.com domain to sales@sqlperformance.ai), `005e51e0-b6a4-417d-b3f6-1924d84d9717` (August 15, 2026 — docs "Next step" panels linking to /features and /download), `ef7d0228-6bcc-45d8-aa80-4b937e79b941` (August 15, 2026 — /features meta description length, heading hierarchy), `74cdc23f-1495-4d97-8bf0-b5ffd1e8cf46` (August 15, 2026 — /features rewrite, per-module sections, docs links), `cb996ce6-2295-4b48-b0da-f2fc985c15f2` (August 15, 2026 — homepage title, Organization alternateName), `6fffe1d4-94e4-42bd-8981-f885a63ebf76` (August 15, 2026 — Open Graph share image), `a36555c7-525e-4c2b-84a5-8bed3f6bcc8c` (August 15, 2026 — BreadcrumbList schema, real PNG logo), `f9d52888-1a96-4623-ae79-044070fe339d` (August 15, 2026 — structured-data rewrite), `9d70e5ff-4be0-4baf-a63e-77126aef965b` (August 15, 2026 — robots.txt), `98924ee8-0183-4319-9dfb-06930ed1f20e` (July 15, 2026), `27c9bad3-014f-4158-85df-44dcf44b9d27` (May 30, 2026).

Check current deployment status with:

```powershell
npx wrangler deployments status --name dbperfstudio-website
```

List deployment history with:

```powershell
npx wrangler deployments list --name dbperfstudio-website
```

## Rollback Procedure

If the live site returns `500` or serves a broken app after deployment:

1. Find the last known good deployment version.
2. Roll back the active Worker.
3. Re-test the production URLs.

Example:

```powershell
npx wrangler rollback <version-id> --name dbperfstudio-website
```

Do not move the production route to another Worker as a first reaction. Confirm whether the issue is a route problem, a Worker runtime problem, or a build artifact problem before changing the route binding.

## Route Safety Rules

Before any deploy or route change, confirm:

- the Worker name in `wrangler.jsonc` is `dbperfstudio-website`
- the service self-reference also points to `dbperfstudio-website`
- `sqlperformance.ai` is still declared with `custom_domain: true`
- the route is still `www.sqlperformance.ai/*`
- no second Worker is competing for the same route

`deploy:cf` enforces the first four automatically and refuses to deploy otherwise.

There is no Wrangler command that lists a Worker's live routes. To read the real state, query the API directly:

```text
GET https://api.cloudflare.com/client/v4/zones/{zone_id}/workers/routes
GET https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/domains
```

If Cloudflare reports a route conflict such as:

```text
A route with the same pattern already exists
```

do not create another Worker or guess. Inspect the currently attached route first.

## OpenNext and Windows Notes

OpenNext warns that Windows is not its ideal runtime for build and preview operations. The current setup works, but there are operational caveats:

- `.open-next` can stay locked if `preview`, `wrangler dev`, or other Node processes remain open
- repeated deploys can fail with `EPERM` on `.open-next`
- stale local preview processes can block rebuilds

If deploy fails with a locked `.open-next` directory:

1. stop any running `npm run preview`, `wrangler dev`, or local Node process for the site
2. remove `.open-next`
3. run the build or deploy command again

Useful commands:

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' } | Select-Object ProcessId, CommandLine
Stop-Process -Id <pid1>,<pid2> -Force
Remove-Item -LiteralPath .open-next -Recurse -Force
```

## Production Issue We Hit and the Fix

During the May 30, 2026 recovery work, the site returned `500` from Cloudflare Worker runtime even though deployment completed.

### Root cause

The build was using a Turbopack server output path that produced an OpenNext runtime chunk loading failure. In practice, the fix was:

- keep the production build on webpack output — on Next 15 that means plain `next build`, with no `--turbopack`
- keep OpenNext deployment on top of that webpack build
- update Next.js dynamic route typing to the async `params: Promise<...>` model

### Why this matters

If someone later adds `--turbopack` to the build script, the Cloudflare runtime issue can reappear. The risk is Turbopack, not the absence of a flag.

## Docs Routing Note

The public docs pages are served from the app routes, not from raw Markdown files.

Important paths:

- `app/docs/page.tsx`
- `app/docs/[slug]/page.tsx`
- `app/docs/modules/[slug]/page.tsx`
- `app/docs/templates.ts`

Supporting Markdown under `docs/` is reference content, not the deployed render path by itself.

This matters because deployment validation must inspect the actual rendered routes, not only the Markdown source files.

## R2 Buckets

As of **August 15, 2026** the account holds exactly two buckets, both bound and both required:

| Bucket | Bound by |
|---|---|
| `dbperfstudio-website-opennext-cache` | `NEXT_INC_CACHE_R2_BUCKET` in [`wrangler.jsonc`](../wrangler.jsonc) |
| `downloads` | `DOWNLOADS_BUCKET` in `api/wrangler.toml` — holds the installer |

Two orphans were deleted on August 15, 2026 after confirming no Worker config bound either one:

- `sipweb-frontend-opennext-cache` — 151 objects / 19.7 MB, all under `incremental-cache/`, left behind by the `sipweb-frontend` Worker removed May 30, 2026. Regenerable cache; emptied first, since R2 refuses to delete a non-empty bucket.
- `sqlperformance-downloads` — empty.

`sqlperformance-downloads` was easy to misread as still in use: [`api/lib/assets.ts`](../../api/lib/assets.ts) contains the string `sqlperformance-downloads`, but that is a per-host *service label* returned by `/api/health`, not a bucket reference. The real download bucket is `downloads`.

Do not delete old buckets impulsively. First confirm they are no longer referenced in any active Cloudflare config, CI job, or manual recovery flow.

## Release Checklist

Use this checklist before and after each release:

1. Confirm `wrangler.jsonc` still targets `dbperfstudio-website` and still declares `sqlperformance.ai` with `custom_domain: true`.
2. Confirm `package.json` build script is still `next build` (no `--turbopack`).
3. Run `npm run lint`.
4. Run `npm run preview`.
5. Test the docs routes locally.
6. Run `npm run deploy`.
   Preferred: `npm run deploy:cf`
7. Verify production URLs.
8. Verify custom domain routing was not changed unexpectedly.
9. Record the new production version ID in this file if the release is important.

## Recommended Future Improvement

This project currently deploys successfully from Windows, but the safer long-term setup is:

- run production deploys from WSL or Linux CI
- keep one canonical Cloudflare Worker name
- keep one canonical route
- avoid ad hoc Worker duplication during incident handling

That change is not required immediately, but it would reduce OpenNext runtime and filesystem edge cases.
