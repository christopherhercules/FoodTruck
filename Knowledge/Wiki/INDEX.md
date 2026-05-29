# Wiki Index

> Top-level map of the Wiki. Maintained by the librarian. Grouped by domain once enough pages exist to warrant grouping.

## Knowledge Management

- [[llm-knowledge-base-methodology]] — the RAW → Wiki → Outputs pattern for LLM-managed personal KBs (Karpathy)
- [[wiki-llm-self-maintenance]] — why LLM-maintained index files + summaries can replace explicit RAG at small scale
- [[kb-linting-health-checks]] — periodic LLM passes to surface inconsistencies, gaps, and missed connections

## Clients

Active POCs on the platform. One page per client — durable context, traceable history.

- [[clients/mas-chingon-restaurant]] — original food POC; dine-in + pickup; reference design for the food vertical
- [[clients/mas-chingon-food-truck]] — companion food truck site; pickup-only; shares AppSync backend with restaurant
- [[clients/bar-1859]] — third original food site; bar concept; stub (details TBD)
- [[clients/hunter-land-clearing]] — first contractor POC; land clearing; on myserviceflows.com
- [[clients/cabinet]] — second contractor POC; cabinets; scaffolded, not yet live
- [[clients/wstn]] — first real-estate POC; apartment locating; built, not yet tested/deployed

## Platform Features (planned / in progress)

- [[social-poster]] — video-to-social-post AI add-on; Lambda + Claude Haiku; design spec, not yet built

## Operations / Business

- [[client-onboarding-guide-template]] — reusable template for per-client plain-language guides (site walkthrough, dashboard, notifications, FB/IG setup); reference impl: WSTN/BROGAN_GUIDE.md
- [[expense-tracking]] — Zoho Books + Zapier + optional Claude MCP for expense categorization; setup not yet done
- [[twilio]] — account, phone numbers, toll-free verification status, and post-approval checklist

## Platform Architecture (FoodTruck codebase)

- [[platform-naming-bleed]] — audit of "Mas Chingon" bleeding into shared infrastructure; bleed map, risk levels, fix options
- [[platform-backend-split]] — planned work: split food and contractor Amplify backends so business data is isolated
- [[platform-tech-stack]] — full inventory of AWS services, tools, and accounts
- [[site-deployment-workflow]] — step-by-step for deploying changes and standing up new sites
- [[demo-site-roster]] — all live URLs across active and dormant sites; demo instructions

## How to use this index

- Scan before asking the librarian to research something — chances are good there's a head start.
- If a topic feels missing, that itself is signal: ask the librarian to ingest sources on it.

## Conventions

- Top-level headings = domains (e.g., `## AI / ML`, `## Business`, `## Personal`, `## Knowledge Management`).
- Within a domain, pages listed as `[[wiki-slug]] — one-line summary`.
- The librarian re-sorts and re-groups during maintenance sweeps.
