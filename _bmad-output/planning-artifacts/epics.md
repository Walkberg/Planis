---
stepsCompleted: [1, 2]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad-output/planning-artifacts/prd-acceptance-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/prd-validation-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/product-brief-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/import-threat-model-Planis-2026-02-03.md
---

# Planis - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Planis, decomposing the requirements from the PRD, UX Design and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: [User] can import a `.ics` file one-time and view an import report summarizing successes and errors.
FR2: [User] can create, edit and delete events with standard fields (title, time, duration, description, attendees, reminders).
FR3: [User] can define basic recurrence rules for events (daily, weekly, monthly).
FR4: [System] can parse a `.ics` file in background (Web Worker) and display import progress to the user.
FR5: [System] can perform partial imports when encountering malformed entries and present recovery options to the user.
FR6: [User] can export their calendar to a `.ics` file for backup.
FR7: [User] can view calendar in Day, Week and Month views.
FR8: [User] can navigate between dates and jump to a specific date.
FR9: [System] displays events with title, time, and status correctly in all views.
FR10: [User] can create or move an event by drag & drop within the calendar interface.
FR11: [User] can complete or edit event details after a drag & drop action.
FR12: [User] can enable local notifications for upcoming events.
FR13: [System] delivers local notifications according to user preferences and event times.
FR14: [System] stores user data locally in `IndexedDB` and keeps data accessible offline.
FR15: [System] can resume an interrupted import or background processing after an application restart.
FR16: [System] supports keyboard navigation and ARIA roles for critical flows to meet WCAG AA for core tasks.
FR17: [User] can configure preferences such as notification settings, timezone, and default calendar view.
FR18: [Support/User] can export a debug report of an import for diagnostics.
FR19: [Power User] can perform full local export/backup of the calendar data.

### NonFunctional Requirements

NFR-P1: UI interactions (navigation, event open/edit) should respond within 2 seconds on typical desktop devices.
NFR-P2: `.ics` import processing for up to 10k events should complete within 10 seconds using background/streaming parsing without blocking the main UI thread.
NFR-S1: User calendar data is stored only locally by default (IndexedDB); no cloud sync occurs without explicit opt-in.
NFR-S2: Imported `.ics` data must be validated and sanitized before rendering to prevent injection vectors.
NFR-S3: All network requests (assets, updates) use HTTPS; sensitive operations require least-privilege permission requests.
NFR-PV1: No telemetry or analytics sent without explicit opt-in; any telemetry must be anonymized.
NFR-R1: Application should support offline read/write for core flows (viewing and editing events) with eventual persistence to `IndexedDB`.
NFR-R2: Interrupted imports or background tasks must be resumable after app restart.
NFR-SC1: System designed to support initial target DAU = 50 and planned to handle 10x growth with <10% degradation in responsiveness.
NFR-A1: Core user flows (onboarding, event CRUD, drag & drop, import) must meet WCAG AA checkpoints.
NFR-I1: MVP supports only one-time `.ics` import/export; no CalDAV or continuous sync required for initial release.
NFR-M1: Provide local debug/export logs for import failures to assist support and diagnostics.

### Additional Requirements

- Use a Web Worker for `.ics` parsing and streaming/chunked processing to avoid blocking the main thread.
- Persist canonical event model in `IndexedDB` with versioned migrations and an idempotent upsert rule (UID + start UTC).
- Implement an Import Assistant UI with preview, partial-import recovery actions, and an ImportReport (importedCount, failedCount, errors).
- Service Worker for offline caching and optionally to help orchestrate long-running imports/resume.
- Batch write strategy (default batch size ~500) with checkpointing to enable resume and idempotency.
- Sanitize imported text before rendering (use DOMPurify or equivalent) and validate VEVENT fields.
- Provide local debug/export for support with sanitized-by-default payloads; full payload only with explicit consent.
- Notification scheduling via browser Notification API with permission prompted only when user enables reminders.
- Accessibility requirements: keyboard operable DnD equivalents, focus management, ARIA roles for calendar grid and forms.
- Performance telemetry only opt‑in; instrument import throughput to verify NFR-P2.
- PWA support / packaging as optional future capability (Service Worker, manifest).

### FR Coverage Map

FR1 → Epic 1: Import & Migration — import summary, report and recovery.
FR2 → Epic 2: Expérience Calendrier — CRUD events and inline edit.
FR3 → Epic 2: Expérience Calendrier — recurrence rules.
FR4 → Epic 1: Import & Migration — background worker + progress.
FR5 → Epic 1: Import & Migration — partial import & recovery.
FR6 → Epic 3: Persistance & Offline — export `.ics` and backups.
FR7 → Epic 2: Expérience Calendrier — Day/Week/Month views.
FR8 → Epic 2: Expérience Calendrier — navigation and date jump.
FR9 → Epic 2: Expérience Calendrier — correct event display.
FR10 → Epic 2: Expérience Calendrier — drag & drop creation/move.
FR11 → Epic 2: Expérience Calendrier — edit after DnD.
FR12 → Epic 4: Notifications & Préférences — enable reminders.
FR13 → Epic 4: Notifications & Préférences — deliver notifications.
FR14 → Epic 3: Persistance & Offline — local storage (IndexedDB).
FR15 → Epic 1 / Epic 3: Resume imports and background processing.
FR16 → Epic 6: Accessibilité & Qualité UX — keyboard/ARIA compliance.
FR17 → Epic 4: Notifications & Préférences — user preferences.
FR18 → Epic 5: Support, Diagnostics & Debug — import debug/export.
FR19 → Epic 3: Persistance & Offline — power-user export/backup.

## Epic List

### Epic 1: Import & Migration
Objectif utilisateur : Importer un `.ics`, prévisualiser, suivre la progression et récupérer les erreurs.
**FRs couverts:** FR1, FR4, FR5, FR15
**Notes impl.:** Web Worker streaming, Import Assistant, ImportReport, checkpointing, performance NFR-P2.

### Story 1.1: Import - Upload & Preview

As a user,
I want to upload a `.ics` file and see a quick preview of sample events before committing,
So that I can verify the file contents and exclude unwanted event groups before import.

**Acceptance Criteria:**

**Given** the user has selected or dragged a `.ics` file into the Import Assistant
**When** the file is accepted for parsing
**Then** the UI displays a preview summary (sample events, total VEVENT count, estimated import time)
**And** the user can toggle inclusion/exclusion for date ranges or sample groups before committing the import
**And** the preview appears within 5 seconds for typical desktop files (per NFR-P1/P2 guidance).

### Story 1.2: Import - Background Parsing & Progress

As a user,
I want the `.ics` file to be parsed in the background while I see live progress updates,
So that the UI remains responsive and I can monitor import progress without blocking the main thread.

**Acceptance Criteria:**

**Given** the user has committed the previewed `.ics` import
**When** the import starts
**Then** parsing runs inside a Web Worker (or equivalent) and emits progress events to the UI
**And** the UI displays a progress bar, imported count, estimated remaining time, and does not block user interactions
**And** the main thread stays responsive (no frame drops or long tasks exceeding 100ms on typical desktop hardware).

### Story 1.3: Import - Partial Recovery & Import Report

As a user,
I want the import process to surface malformed entries and offer recovery actions,
So that I can inspect errors, retry fixes, or accept partial imports without losing good data.

**Acceptance Criteria:**

**Given** the import worker has processed the `.ics` file
**When** malformed or failed VEVENTs are detected
**Then** the ImportReport lists failed entries with error reasons and sample problematic lines
**And** the UI offers actions: retry parsing for failed items, exclude specific entries, or download a sanitized debug export
**And** imported events are committed incrementally so successful entries are available immediately while failures are presented for resolution.

### Story 1.4: Import - Commit, Batch Writes & Idempotency

As a user,
I want validated events to be committed incrementally and safely so that successful events are available immediately and retries do not create duplicates,
So that I can start using my calendar right away and safely retry imports if issues occur.

**Acceptance Criteria:**

**Given** the import worker emits validated batches of events
**When** a batch is ready to persist
**Then** the system writes the batch transactionally to `IndexedDB` using an idempotent upsert key (e.g., `uid + startUtc`)
**And** a checkpoint is recorded after each successful batch so the import can resume from the next batch on interruption
**And** re-running or retrying the same import does not create duplicate events (idempotent behavior)
**And** the default batch size is configurable (default ~500) and the write operation reports success/failure per-batch to the ImportReport.

### Story 1.5: Import - Completion, First Render & Undo

As a user,
I want the app to present a clear completion summary and render my first imported events immediately,
So that I can verify the import succeeded and start interacting with my calendar without delay.

**Acceptance Criteria:**

**Given** all import batches have been processed and committed
**When** the import completes
**Then** the UI shows a completion summary with `importedCount`, `failedCount`, `timeElapsed`, and a link to the ImportReport
**And** the calendar view renders the first visible events within 2 seconds of completion
**And** the UI presents an undo option allowing the user to revert the last import within a limited time window (e.g., 2 minutes) and provides an action to download the debug export if failures occurred.

### Epic 2: Expérience Calendrier (Core)
Objectif utilisateur : Voir et gérer les événements (CRUD), règles de récurrence, vues jour/semaine/mois, navigation, drag & drop.
**FRs couverts:** FR2, FR3, FR7, FR8, FR9, FR10, FR11
**Notes impl.:** UI réactive <2s (NFR-P1), inline edit, accessible DnD.

### Story 2.1: Calendar Views - Day/Week/Month Rendering

As a user,
I want to view my calendar in Day, Week, and Month modes and see events rendered clearly,
So that I can inspect my schedule at different granularities and find events quickly.

**Acceptance Criteria:**

**Given** the user opens the calendar view
**When** the view is Day, Week, or Month
**Then** events are displayed with title, time, and status in the correct time slots
**And** switching between views updates the layout without errors and within the perceived performance budget (<2s)
**And** the views handle typical event densities (including multi-day events and overlapping events) correctly.


### Epic 3: Persistance & Offline
Objectif utilisateur : Stocker et retrouver ses données localement, reprendre imports interrompus, exporter/sauvegarder.
**FRs couverts:** FR6, FR14, FR15, FR19
**Notes impl.:** IndexedDB schema + migrations, export `.ics`, PWA/Service Worker.

### Epic 4: Notifications & Préférences
Objectif utilisateur : Configurer rappels et préférences (timezone, vue par défaut).
**FRs couverts:** FR12, FR13, FR17
**Notes impl.:** Notification API, permission on opt-in, settings persistence.

### Epic 5: Support, Diagnostics & Debug
Objectif utilisateur/support : Fournir rapports d'import et outils debug pour résoudre incidents.
**FRs couverts:** FR18
**Notes impl.:** Debug export (sanitized par défaut), import reports, support UX.

### Epic 6: Accessibilité & Qualité UX
Objectif utilisateur : Assurer que les flux critiques sont accessibles et conformes WCAG AA.
**FRs couverts:** FR16, (NFR-A1 appliquée transversalement)
**Notes impl.:** Keyboard DnD equivalents, ARIA roles, focus management.

## Epic {{N}}: {{epic_title_N}}

{{epic_goal_N}}

### Story {{N}}.{{M}}: {{story_title_N_M}}

As a {{user_type}},
I want {{capability}},
So that {{value_benefit}}.

**Acceptance Criteria:**

**Given** {{precondition}}
**When** {{action}}
**Then** {{expected_outcome}}
**And** {{additional_criteria}}
