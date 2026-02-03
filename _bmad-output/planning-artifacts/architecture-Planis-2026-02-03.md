---
prd: _bmad-output/planning-artifacts/prd.md
workflow: create-architecture
author: walkberg
date: 2026-02-03
createdAt: 2026-02-03T12:12:00Z
status: draft
documentCounts:
  prdSections: 1
  diagrams: 0
lastUpdatedStep: 1
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/prd-acceptance-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/prd-validation-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/import-threat-model-Planis-2026-02-03.md
stepsCompleted: [1]
lastUpdatedStep: 6
stepsCompleted: [1, 2, 3, 4, 5, 6]
---

# Architecture Decision Document — Planis

## Executive Summary

This document records architecture decisions for Planis (calendar import + event scheduling SPA). It is derived from the PRD and focuses on implementation-ready constraints, component responsibilities, data flow, security, and performance targets for the MVP.

Source PRD: _bmad-output/planning-artifacts/prd.md

## High-level Goals

- Meet PRD NFR targets: `.ics` import up to ~10k events <10s (non-blocking), UI interactions <2s.
- Store user data locally (`IndexedDB`) and enable offline read/write.
- Use Web Worker/streaming import pipeline to avoid UI blocking.
- Achieve WCAG AA for core flows.

## System Overview

Components (MVP):

- Client SPA (React + TypeScript) — UI, routing, state, accessibility.
- Import Worker — Web Worker performing `.ics` parsing, validation, and incremental writes to `IndexedDB`.
- Storage Layer — IndexedDB schema and data migration strategy.
- Service Worker — offline caching, asset caching, background processing orchestration.
- Notification Agent — permissions, schedule, local Notification API integration.
- Diagnostics & Support Exporter — local debug/export for failed imports.

## Component Responsibilities

- Client SPA: rendering calendar views (Day/Week/Month), UI interactions (drag/drop), event CRUD, settings UI.
- Import Worker: parse `.ics` stream/chunks, validate each VEVENT, normalize dates/timezones, report progress and partial errors.
- Storage Layer: canonical event model, conflict resolution rules, export/import routines.
- Service Worker: cache shell resources, enable offline served UI, optionally resume import on reconnect.

## Data Model (Sketch)

- Event { id, title, start, end, allDay, recurrenceRule, attendees[], description, metadata }
- ImportReport { importedCount, failedCount, errors[] }

## Import Pipeline & Threat Model (MVP)

Import pipeline:

1. User selects `.ics` file → `File` passed to Import Worker.
2. Worker parses file in chunks, emits validated Event objects.
3. Valid events are written transactionally into `IndexedDB` in batches.
4. Worker reports progress and errors; UI surfaces partial recovery actions.

Threat model (short):

- Malformed `.ics` entries causing parser exceptions — mitigate with robust parser libraries and guarded parsing loops.
- Injection via textual fields (descriptions) — sanitize before rendering and before storing metadata used in attributes.
- Resource exhaustion (huge files) — cap chunk memory, stream parse, and fail fast with user-facing limits.

Required tests:

- Malformed `.ics` with invalid dates and missing UID.
- Large `.ics` (10k events) performance and memory profiling.
- Timezone edge cases with DST transitions.

## Storage & Offline Strategy

- Canonicalize events in `IndexedDB` with object stores: `events`, `imports`, `settings`.
- Use versioned migrations for schema changes; include a migration runner on startup.
- Keep import write batch size tunable (default 500 events).

## Performance & Scaling

- Use Web Worker + chunked writes to meet NFR-P2.
- Instrument import throughput and surface telemetry only with opt-in.

## Security & Privacy Controls

- Local-only storage by default; encryption optional for exports.
- Sanitize imported fields, validate types, do not execute content as HTML.
- Prompt for Notification permission only when user enables reminders.

## Deployment & Packaging

- Web app hosted as static site (Vite) with optional PWA configuration and Electron packaging in Phase 2.

## Mapping to PRD (Actionable Next Steps)

- Add per-FR acceptance criteria and owner fields here as a table (placeholder below).

| FR | Owner | Priority | Acceptance Criteria | Implementation Notes |
|----|-------|----------|---------------------|----------------------|
| FR1 | TBD | MUST | Given a valid `.ics`, when import completes, then import report shows counts and errors. | Worker + import report UI |
| FR4 | TBD | MUST | Worker parses file and UI shows progress indicator; no main-thread freeze. | Web Worker, chunking |
(Populate remaining FR rows from PRD)
| FR | Owner | Priority | Acceptance Criteria | Implementation Notes |
|----|-------|----------|---------------------|----------------------|
| FR1 | Import Worker | MUST | Given a valid `.ics`, when import completes, then import report shows importedCount and failedCount and UI stayed responsive. | Web Worker + batch writes; import report UI |
| FR2 | Frontend | MUST | Users can create, edit and delete events and see changes reflected in the calendar and persisted to IndexedDB within 2s. | CRUD UI + local persistence |
| FR3 | Frontend | SHOULD | Users can set basic recurrence (daily/weekly/monthly) and occurrences appear correctly in calendar views. | Recurrence normalization library |
| FR4 | Import Worker | MUST | `.ics` parsing runs in a Worker, reports progress, and does not block the main thread. | Web Worker + streaming parser |
| FR5 | Import Worker | SHOULD | System imports valid entries, reports malformed entries with error details, and offers partial-recovery actions. | Partial-import UX + error reporting |
| FR6 | Frontend | SHOULD | User can export current calendar to a `.ics` file and download it successfully. | Export routine, size/encoding checks |
| FR7 | Frontend | MUST | Day/Week/Month views render events correctly and navigation between views functions without errors. | Calendar view components, view tests |
| FR8 | Frontend | MUST | User can navigate between dates and jump to a specific date; view updates within performance budget. | Date picker + route handling |
| FR9 | Frontend | MUST | Events display title, time, and status correctly in all views and in event details. | Event rendering tests |
| FR10 | Frontend | MUST | Drag & drop creates or moves events and persists the change; undo available. | DnD handlers + persistence hooks |
| FR11 | Frontend | MUST | After drag & drop, user can complete or edit event details and save changes persistently. | Event detail modal/form integration |
| FR12 | Frontend | SHOULD | User can enable local notifications; permission requested only when enabling and setting is persisted. | Permissions flow + settings UI |
| FR13 | Frontend | SHOULD | System delivers local notifications according to user preferences when permission granted. | Notification scheduling + local triggers |
| FR14 | Frontend | MUST | All user calendar data is stored locally in IndexedDB and accessible offline. | IndexedDB schema + access layer |
| FR15 | Import Worker | SHOULD | Interrupted imports can resume from last known position without duplicating events. | Import checkpointing + idempotent writes |
| FR16 | Frontend | MUST | Core flows (onboarding, CRUD, DnD, import) are operable via keyboard and meet WCAG AA for tested scenarios. | Accessibility testing checklist |
| FR17 | Frontend | SHOULD | User can configure preferences (timezone, default view, notifications) and changes persist. | Settings store + timezone handling |
| FR18 | Support | SHOULD | Support can export a debug report for imports including errors, imported counts, and sample problematic entries. | Debug exporter + shareable artifact |
| FR19 | Frontend | CAN | Power users can perform full local export/backup of calendar data; export succeeds for typical dataset sizes. | Full export workflow, size limits |
(Populate remaining implementation notes and owners as team members are assigned)

(Populate remaining FR rows from PRD)

## Open Decisions

- Exact IndexedDB schema (store names, indexes).
- Batch size and backpressure strategy for imports.
- Whether to include optional local encryption for exports in MVP.

## Next Steps

1. Populate Owner and Priority for each FR and add acceptance criteria (I can scaffold this next). 
2. Produce a lightweight migration plan for `IndexedDB` schema.
3. Add component diagrams (SVG) and include in this document.

## Project Context Analysis

### Requirements Overview

- Functional: Import `.ics` one-time; CRUD events; drag & drop; recurrence; export `.ics`; local notifications; offline via IndexedDB.
- Non-Functional: Import performance (target ~10k events ≈10s background), UI latency <2s, WCAG AA accessibility, local-only data (privacy), resumable/idempotent imports, telemetry opt‑in.
- Acceptance/QA: PRD contains FR1..FR19; per-FR owners and per-FR tests are partially provided in `prd-acceptance` but owners remain `TBD`.

### Non-Functional Drivers (impacting architecture)

- Performance (import pipeline) → necessitates Web Worker, chunked parsing, batch writes, and backpressure control.
- Data resiliency → checkpointing, idempotent upserts, migration strategy for IndexedDB.
- Security/privacy → sanitization, opt‑in telemetry, debug export sanitization.
- Accessibility → component patterns (keyboard DnD, focus management).

### Scale & Complexity

- Complexity: Medium (single-device web SPA with moderate data volume; high UX interaction complexity).
- Primary domain: Web SPA (client-heavy), offline-first storage, background processing.
- Cross-cutting concerns: Import pipeline robustness, data model/migrations, accessibility, privacy/security, observable metrics (opt‑in).

### Technical Constraints & Dependencies

- Browser APIs: IndexedDB, Web Worker, Service Worker, Notifications API.
- Libraries: robust `.ics` parser, timezone library, sanitizer for rendering descriptions.
- Device constraints: storage quota, varying CPU/memory across browsers.

### Open Challenges / Decisions

- Exact IndexedDB schema and indexes.
- Batch size/backpressure defaults and tuning strategy.
- Dedup/upsert rule (UID + start timestamp canonicalization).
- Handling very large imports on low-resource devices (fallback/abort policy).
- Telemetry/data export sanitization policy.

### Suggested Next Actions (architectural)
1. Define canonical event schema and migration runner for IndexedDB.
2. Prototype import worker streaming pipeline + checkpointing (batch writes, default batch 500).
3. Define sanitization rules and debug export format (sanitized by default).
4. Define acceptance tests for import (malformed input, large import, resume).
5. Assign owners/priorities per FR (from `prd-acceptance`).

---

Please confirm to save this analysis to the document (reply `C`), run Advanced Elicitation (`A`), or Party Mode (`P`).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data persistence: canonical event schema and IndexedDB stores (`events`, `imports`, `settings`) with a migration runner.
- Import pipeline: Web Worker streaming parser with checkpointed, idempotent batch writes (default batch size 500).
- Sanitization: all rendered text sanitized before rendering; debug exports sanitized by default.

**Important Decisions (Shape Architecture):**
- State management: small centralized store (recommended: Zustand) to simplify worker ↔ UI coordination.
- IndexedDB helper: use `idb` (or equivalent) to simplify schema migrations and transactions.
- Import dedup rule: canonical key = `UID + start ISO timestamp` (upsert semantics).

**Deferred Decisions (Post-MVP):**
- Optional encrypted local exports and opt‑in sync/backups.
- Advanced telemetry and analytics (only after opt‑in and privacy review).

---

### Data Architecture

- Stores: `events`, `imports`, `settings`.
- Canonical event model: `{ id, uid, title, startUtc, endUtc, allDay, recurrenceRule, attendees, description, metadata }`.
- Dedup/upsert: use `uid + startUtc` as deterministic key to avoid duplicates on resume.
- Migrations: implement versioned migration runner on app startup.

Rationale: local-first IndexedDB enables offline usage and performance; explicit migration runner prevents schema drift.

### Import Worker & Pipeline

- Implementation: a dedicated Web Worker that stream-parses `.ics` in chunks, validates VEVENTs, emits progress and batches of validated events to main thread for batched writes.
- Batch write defaults: 500 events per transaction (configurable), checkpoint after each batch for resume.
- Failure handling: collect failed entries into `ImportReport` with reasons; allow partial commit and recovery UI.
- Suggested libs: `ical.js` (parser), `rrule` (recurrence normalization) — verify current stable releases when implementing.

Rationale: streaming parse + batch writes avoids main-thread blocking and supports large imports.

### Authentication & Security

- MVP: no external authentication required (local-only app); if auth later, adopt OAuth/OIDC patterns server-side.
- Sanitization: use a robust sanitizer (e.g., DOMPurify) when rendering descriptions and any HTML-like content.
- Telemetry: opt-in only; debug export must default to sanitized samples unless user explicitly includes full payload.

Rationale: minimize surface for privacy concerns while enabling safe rendering and support flows.

### API & Communication Patterns

- No external API required for MVP — all processing local.
- Worker ↔ UI protocol: structured messages via `postMessage` with explicit action types (`parse-progress`, `batch-ready`, `import-complete`, `error`).
- Error handling: standardized error objects with codes and human-friendly messages for UI.

Rationale: simple message protocol reduces integration errors and makes worker implementation testable.

### Frontend Architecture

- Framework: Vite + React + TypeScript (existing project alignment).
- State: lightweight global store (Zustand) + local component state; persist authoritative state to IndexedDB.
- Component patterns: small, testable components; import assistant isolated module; worker integration via hooks (`useImportWorker`).
- Performance: virtualize large lists, offload parsing to worker, and lazy-load heavy modules (e.g., calendar heavy views).

Rationale: matches current codebase and provides a pragmatic developer experience for the team.

### Infrastructure & Deployment

- Hosting: static site hosting (Vercel, Netlify, GitHub Pages) as primary option.
- CI/CD: GitHub Actions — lint, typecheck, unit tests, build, preview deployment.
- Monitoring: opt-in diagnostics; support debug export for user-reported issues.

Rationale: static hosting simplifies deployment while CI ensures quality gates.

### Decision Impact Analysis

**Implementation Sequence:**
1. Define canonical event schema and implement IndexedDB migration runner.
2. Scaffold import worker and message protocol; implement streaming parser + batch writes.
3. Build import assistant UI and ImportReport handling.
4. Integrate state store and persistence layer with worker flows.
5. Add QA tests for malformed inputs, large imports, and resume behavior.

**Cross-Component Dependencies:**
- Import worker design depends on event schema and upsert semantics.
- UI import assistant depends on worker message protocol and ImportReport structure.
- Persistence layer (idb wrapper) must support transactions and migrations used by both UI and worker.

---

What would you like to do next? Reply `A` for Advanced Elicitation, `P` for Party Mode, or `C` to save these decisions and proceed to `step-05-patterns.md`.

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

- Naming, structure, formats, communication, and process areas where AI agents could diverge if patterns are not specified.

### Naming Patterns

**Database Naming Conventions:**
- Use lowercase snake_case for stores and keys (e.g., `events`, `imports`, `settings`).
- IndexedDB object store names: `events`, `imports`, `settings`.
- Field names: snake_case in persistence layer (e.g., `start_utc`) and convert to camelCase in JS layer when mapped to models.

**API & Route Naming:**
- REST routes (if any): use plurals (e.g., `/events`).
- Route params: `:id` style, consistent across routes.

**Code Naming Conventions:**
- File names: kebab-case for files (`import-worker.ts`) and PascalCase for React components (`ImportAssistant.tsx`).
- JS/TS variables and functions: camelCase.

### Structure Patterns

**Project Organization:**
- Feature-first layout under `src/features/*` for major domains (import, calendar, settings).
- Shared components under `src/components`, utilities under `src/lib` or `src/utils`, workers under `src/workers`.
- Tests co-located with files: `Component.test.tsx` beside `Component.tsx`.

**File Structure:**
- Config in `config/` or root `vite.config.ts` and `tailwind.config.js`.
- Assets in `public/` and images under `src/assets`.

### Format Patterns

**API Response Formats & Data Exchange:**
- JSON field naming: camelCase in runtime JS objects; persistence uses snake_case.
- Dates: ISO 8601 strings in UTC for storage (`2026-02-03T12:00:00Z`), displayed localized in UI.
- Error format: `{ code: string, message: string, details?: any }`.

### Communication Patterns

**Worker ↔ UI Messages:**
- Standard message shape: `{ type: string, payload: any, meta?: { batchId?: string, timestamp?: string } }`.
- Message types: `parse-progress`, `batch-ready`, `import-complete`, `import-error`.

**Event Naming:**
- Use dot.case for events (e.g., `import.started`, `import.batchCompleted`, `import.failed`).

### Process Patterns

**Error Handling:**
- All errors bubble as standardized objects; UI shows human-friendly messages and logs details to debug export.
- Use error boundaries for React components that render imported content.

**Loading States:**
- Use local loading flags per component and standard `isLoading` naming; global import progress via `importProgress` store.

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow the naming and structure rules listed above.
- Use the defined worker message protocol for import flows.
- Write tests for import worker behavior (parse resilience, batch writes, resume logic).

**Pattern Enforcement:**
- Document patterns in `docs/architecture/patterns.md` and add linting rules where possible (ESLint rules, file naming checks).
- Violations reported as issues in the repository under `docs/architecture/pattern-violations.md` and reviewed during PRs.

### Examples & Anti-Patterns

**Good Example:**
- Worker message: `{ type: 'batch-ready', payload: { events: [...] }, meta: { batchId: 'b-123', timestamp: '...' } }`.

**Anti-Pattern:**
- Agents writing mixed naming styles (some snake_case in JS objects, some camelCase persisted) or inconsistent event types.

---

Reply `C` to save these patterns into the architecture document and proceed to `step-06-structure.md`, or `A`/`P` to explore further.

## Project Structure & Boundaries

### Mapping Requirements to Components

- Import pipeline & parsing: `src/features/import/*` (Import Assistant UI, import worker, import reports).
- Calendar UI & interactions: `src/features/calendar/*` (views, event cards, DnD handlers).
- Persistence and migrations: `src/lib/storage/*` (IndexedDB wrappers, migration runner, schema definitions).
- Shared UI components: `src/components/*` (buttons, modals, toasts, form controls).
- Utilities and domain logic: `src/lib/*` (date/time normalization, recurrence helpers, sanitization wrappers).
- Support & diagnostics: `src/features/support/*` (debug export, logs, import reports).

### Recommended Project Tree (concrete for this repo)

planis/
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .eslintrc.cjs
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   └── assets/
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── app.css
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── features/
│   │   ├── import/
│   │   │   ├── ImportAssistant.tsx
│   │   │   ├── importWorker.ts
│   │   │   └── importReport.tsx
│   │   └── calendar/
│   │       ├── CalendarView.tsx
│   │       └── EventCard.tsx
│   ├── lib/
│   │   ├── storage/
│   │   │   ├── idb.ts
│   │   │   └── migrations/
│   │   ├── time/
│   │   │   └── timezone.ts
│   │   └── sanitize/
│   │       └── sanitizer.ts
│   ├── workers/
│   │   └── import.worker.ts
│   └── types/
│       └── index.ts
├── tests/
│   ├── unit/
│   └── e2e/
└── docs/
  └── architecture/
    ├── patterns.md
    └── project-structure.md

### Integration Boundaries

- Worker ↔ UI: `postMessage` protocol with typed messages in `src/workers/protocol.ts`.
- Persistence boundary: high-level `Storage` API in `src/lib/storage/idb.ts` abstracts raw IndexedDB operations.
- UI ↔ Domain: components call domain services in `src/lib` rather than accessing storage directly.

### Data Boundaries

- Canonical event schema stored in `events` store; transformations to/from UI models occur in `src/lib/storage`.
- All dates normalized to UTC for storage; localization in UI layer only.

### Tests & Validation

- Unit tests for parsing, sanitizer, and storage migration logic under `tests/unit`.
- Integration tests for import worker + persistence under `tests/e2e` (use Playwright for headless browser scenarios).
- CI pipeline runs lint, typecheck, unit tests, build and a small import integration test.

---

Reply `C` to save this project structure into the architecture document and proceed to `step-07-validation.md`, or `A`/`P` to explore further.


## Starter Template Evaluation

### Primary Technology Domain

- Identified domain: Web SPA (client-heavy). The workspace already contains a Vite + React + TypeScript setup (`planis/package.json`), making `Vite + React + TypeScript` the natural starter.

### Selected Starter: Vite + React + TypeScript

**Rationale for Selection:**
- Existing project uses Vite and React with TypeScript; continuing this avoids refactoring and keeps developer ergonomics.
- Vite provides fast dev server and modern build tooling suited for SPA and PWA targets.
- TypeScript aligns with current codebase and improves long-term maintainability for complex client logic (import worker, IndexedDB migrations).

**Suggested Initialization Commands (if creating a new project):**

```bash
npm create vite@latest planis -- --template react-ts
cd planis
npm install
```

Optional (Tailwind + Storybook):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D storybook
```

**Architectural Decisions Provided by This Starter:**

- Language & Runtime: TypeScript on the browser (ESM). Modern bundling with Vite.
- Styling Solution: unopinionated — Tailwind recommended (scaffold above) for rapid component styling.
- Build Tooling: Vite build and preview scripts; `tsc` for type checking in CI.
- Testing Framework: none by default — recommend `vitest` for unit tests and `playwright` for end-to-end import integration tests.
- Code Organization: component-first React structure; isolate import worker and storage layer modules; maintain an `experimental/` area for worker prototypes.
- Development Experience: fast HMR via Vite, TypeScript typings for safer refactors, linting via ESLint already present.

**Next Step:** If you confirm, I will append this evaluation to the document (already appended) and proceed to `step-04-decisions.md` to begin specific architectural decisions. Reply `C` to continue, `A` for Advanced Elicitation, or `P` for Party Mode.
