---
title: "PRD Acceptance Criteria & Priorities — Planis"
author: walkberg
date: 2026-02-03
---

# Acceptance Criteria & Priorities

Ce fichier cartographie chaque FR du PRD avec une brève condition d'acceptation (Gherkin-like), une priorité (MUST/SHOULD/CAN) et un propriétaire (`TBD`).

- FR1 — Import `.ics` (MUST) — Acceptance: Given a valid `.ics` file, when the user imports it, then the import completes and the import report shows `importedCount` and `failedCount` and the UI remains responsive. Owner: TBD.
- FR2 — CRUD Événements (MUST) — Acceptance: Given the calendar UI, when the user creates/edits/deletes an event, then the change is persisted to `IndexedDB` and visible in the calendar within 2s. Owner: TBD.
- FR3 — Récurrence basique (SHOULD) — Acceptance: Given a recurring rule (daily/weekly/monthly), when created, then occurrences render correctly in Day/Week/Month views. Owner: TBD.
- FR4 — Import en background (MUST) — Acceptance: Given a large `.ics`, when import starts, then parsing runs in a Web Worker and the main thread stays responsive; progress is reported. Owner: TBD.
- FR5 — Partial imports & recovery (SHOULD) — Acceptance: Given malformed entries in `.ics`, when import completes, then valid entries are saved, invalid entries are listed with error details and the UI offers recovery actions. Owner: TBD.
- FR6 — Export `.ics` (SHOULD) — Acceptance: Given user requests export, when executed, then a `.ics` file is generated representing current calendar data and is downloadable. Owner: TBD.
- FR7 — Views (MUST) — Acceptance: Given calendar data, when user switches to Day/Week/Month, then events display correctly and navigation works without errors. Owner: TBD.
- FR8 — Navigation (MUST) — Acceptance: Given a date navigation action, when the user jumps to a date, then the view updates and remains within the 2s performance bound. Owner: TBD.
- FR9 — Event rendering (MUST) — Acceptance: Given any event, when displayed in any view, then title, time and status are correct and consistent. Owner: TBD.
- FR10 — Drag & Drop (MUST) — Acceptance: Given drag & drop action, when user moves or creates an event, then the change is persisted and undo is available. Owner: TBD.
- FR11 — Post-DnD edit (MUST) — Acceptance: Given a moved event, when the user edits details, then saves, changes persist and display accurately. Owner: TBD.
- FR12 — Notifications opt-in (SHOULD) — Acceptance: Given notifications setting enabled, when user enables reminders, then the app requests permission and schedules local notifications accordingly. Owner: TBD.
- FR13 — Deliver notifications (SHOULD) — Acceptance: Given permission granted, when an event time arrives, then a local notification is shown as configured. Owner: TBD.
- FR14 — Local storage offline (MUST) — Acceptance: Given offline state, when user views/edits events, then operations work locally and persist to `IndexedDB`. Owner: TBD.
- FR15 — Import resume (SHOULD) — Acceptance: Given an interrupted import, when the user restarts the app, then import can resume from last checkpoint without duplicating events. Owner: TBD.
- FR16 — Accessibility (MUST) — Acceptance: Given core flows (onboarding, import, CRUD, DnD), when tested, then they meet WCAG AA checkpoints for keyboard and assistive tech in scoped scenarios. Owner: TBD.
- FR17 — Preferences (SHOULD) — Acceptance: Given preference changes (timezone, default view), when saved, then they persist and affect rendering/state on reload. Owner: TBD.
- FR18 — Support debug export (SHOULD) — Acceptance: Given support request, when user or support requests a debug export, then a diagnostic package (import report, sample problematic entries, logs) can be generated and exported. Owner: TBD.
- FR19 — Full export (CAN) — Acceptance: Given a power-user export request, when executed on typical dataset sizes, then export completes within device resource limits and produces a downloadable archive or `.ics`. Owner: TBD.

Notes:
- Priorities follow PRD guidance; owners left as `TBD` for assignment.
- Si vous voulez, j'intègre ces critères directement dans `prd.md` (inline) ou je crée des tâches par FR dans le backlog.
