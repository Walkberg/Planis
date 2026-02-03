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

## Open Decisions

- Exact IndexedDB schema (store names, indexes).
- Batch size and backpressure strategy for imports.
- Whether to include optional local encryption for exports in MVP.

## Next Steps

1. Populate Owner and Priority for each FR and add acceptance criteria (I can scaffold this next). 
2. Produce a lightweight migration plan for `IndexedDB` schema.
3. Add component diagrams (SVG) and include in this document.
