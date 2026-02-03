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
