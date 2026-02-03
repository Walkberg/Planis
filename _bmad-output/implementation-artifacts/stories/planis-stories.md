# Planis — Stories extracted from `epics.md`

## Summary
Extracted stories and implementation tasks from `epics.md` (Import, Calendar UX, Persistence, Notifications, Support, Accessibility).

## Top-priority stories (implementation order)

1. Story 1.1 — Import: Upload & Preview
   - Tasks:
     - Add `ImportAssistant` UI component (file picker + drag/drop)
     - Quick parse head of `.ics` (first N VEVENTs) in main thread fallback
     - Integrate Web Worker parsing stub (worker registration)
     - UI: preview summary (sample events, total count, est. import time)
   - Branch: `feat/import-assistant`

2. Story 1.2 — Import: Background Parsing & Progress
   - Tasks:
     - Implement Web Worker for streaming `.ics` parsing
     - Define progress event contract (message shape)
     - Hook worker -> UI progress bar and live counts
     - Ensure main thread responsiveness (no long tasks)
   - Branch: `feat/import-worker`

3. Story 1.3 — Import: Partial Recovery & Import Report
   - Tasks:
     - ImportReport model and UI
     - List failed entries + error reasons + retry/exclude actions
     - Download sanitized debug export
   - Branch: `feat/import-report`

4. Story 1.4 — Import: Commit, Batch Writes & Idempotency
   - Tasks:
     - IndexedDB `events` store + upsert helper (uid+startUtc)
     - Batch write API with checkpointing
     - Configurable batch size (default 500)
   - Branch: `feat/indexeddb-import`

5. Story 2.x — Calendar Core (views, quick-add, DnD)
   - Tasks:
     - Components: `CalendarView` (Day/Week/Month)
     - Quick-add flow, full-event editor
     - Drag & drop with snap, keyboard equivalents
   - Branch: `feat/calendar-core`

6. Story 3.x — Export & Backup
   - Tasks: `.ics` export generator, download UI, no external network
   - Branch: `feat/export-ics`

7. Story 4.x — Notifications & Preferences
   - Tasks: opt-in permission flow, schedule reminders, retry/backoff
   - Branch: `feat/notifications`

8. Story 5.x — Support & Debug
   - Tasks: debug export sanitization, support actions (replay import)
   - Branch: `feat/support-debug`

9. Story 6.x — Accessibility & QA
   - Tasks: keyboard DnD, ARIA roles, focus management, WCAG AA checks
   - Branch: `chore/accessibility`

## Suggested first deliverable (MVP slice)
- Implement Story 1.1 and 1.2 (branches `feat/import-assistant` + `feat/import-worker`) with:
  - Worker stub that emits progress
  - UI import assistant with preview and progress bar
  - Minimal IndexedDB stub to accept persisted batches (no migrations yet)
- Add unit tests for worker message handling and preview parsing.

## Next actions I can run for you
- Create local issue files (`_bmad-output/implementation-artifacts/issues/`) + branch stubs. 
- Start implementing Story 1.1: add `ImportAssistant` component and worker stub in `src/components/`.
- Create initial IndexedDB helper and tests for upsert key (uid+startUtc).

Tell me which next action you want (create issues, implement Story 1.1, or create branches).