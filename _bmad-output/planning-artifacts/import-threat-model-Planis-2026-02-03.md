---
prd: _bmad-output/planning-artifacts/prd.md
architecture: _bmad-output/planning-artifacts/architecture-Planis-2026-02-03.md
author: walkberg
createdAt: 2026-02-03T12:20:00Z
status: draft
---

# Threat Model & Test Cases — `.ics` Import Pipeline (Planis)

Purpose: document threat surface, mitigations, and concrete test cases to validate the import pipeline described in the architecture document. Target: MVP one-time `.ics` import with background parsing and resumable, idempotent writes to `IndexedDB`.

## Assets

- User calendar data (events) stored in `IndexedDB`.
- Import process state and checkpoints.
- ImportReport (counts, errors).
- UI components that render imported fields (title, description).

## Actors

- Legitimate user (local file owner)
- Malicious actor supplying crafted `.ics` (via social engineering or by obtaining a file)
- Local attacker with device access (limited by OS-level device security)

## Entry Points

- File upload UI (drag/drop or file picker)
- Clipboard-like paste (if supported)
- Background Worker input channel

## Threats, Severity & Mitigations

1) Parser crash / DoS via malformed `.ics` (Severity: High)

  - Threat: A crafted `.ics` triggers unhandled exceptions or excessive CPU/memory use.
  - Mitigation: use robust streaming parser; wrap parse loops with try/catch and per-chunk memory caps; impose total size and time limits; abort parser on threshold.

2) Injection via textual fields (Severity: High)

  - Threat: Descriptions or other text contain HTML/JS or malformed control sequences that, when rendered, cause XSS or UI issues.
  - Mitigation: Sanitize all rendered text using a whitelist-based sanitizer; store raw text but render only safe-encoded output; avoid innerHTML.

3) Duplicate or conflicting UIDs causing duplicate events or overwrite (Severity: Medium)

  - Threat: Two VEVENTs with same UID cause inconsistent dedup or overwrite semantics.
  - Mitigation: adopt deterministic dedup rules (UID + start time canonical key); writes must be idempotent using upsert semantics and write transactions.

4) Timezone & DST edge-case corruption (Severity: Medium)

  - Threat: Events parsed with ambiguous timezone info lead to incorrect scheduled times.
  - Mitigation: Normalize dates to UTC with timezone parsing library; surface timezone warnings for ambiguous entries in ImportReport.

5) Resource exhaustion on large imports (Severity: Medium)

  - Threat: Device runs out of memory or import blocks UI.
  - Mitigation: chunk parsing, batch writes (configurable batch size, default 500), use Web Worker, progress UI, and early abort option.

6) Sensitive data leakage via telemetry (Severity: Medium)

  - Threat: Import contents leak via telemetry or error reports.
  - Mitigation: telemetry opt-in only; debug export sanitizes PII by default and includes only truncated samples unless user explicitly includes full payload.

7) Partial import leading to inconsistent state (Severity: Medium)

  - Threat: Interrupted imports leave half-written state and duplicate entries on resume.
  - Mitigation: checkpoint after each batch; import resume uses last checkpoint and writes idempotently; provide rollback option in UI.

## Test Cases (Automated + Manual)

Each test below indicates objective, steps, expected result, and severity.

1. Malformed `.ics` entries (parser resilience)

  - Objective: verify parser does not crash and reports errors for malformed lines.
  - Steps: craft `.ics` with invalid VEVENT lines and missing END:VCALENDAR; upload via file picker.
  - Expected: ImportReport `failedCount` > 0, import completes or aborts gracefully, UI shows error summary; no main-thread crash. (Severity: High)

2. Large import performance (10k events)

  - Objective: verify import completes in target time and UI remains responsive.
  - Steps: generate `.ics` with 10,000 well-formed VEVENTs; start import on representative device/browser.
  - Expected: Import completes within NFR target (≈10s on target desktop) or within a measured SLA using background worker; UI remains interactive; progress shows updates. (Severity: High)

3. Duplicate UID handling

  - Objective: ensure dedup rules prevent duplicates and preserve intended behavior.
  - Steps: import two `.ics` sequentially where some events share UIDs with updated fields (title/time changed).
  - Expected: Records are upserted according to dedup rule (UID+start), no accidental duplicates; ImportReport lists updated vs skipped entries. (Severity: Medium)

4. Timezone & DST edge cases

  - Objective: ensure correct normalization across DST transitions.
  - Steps: include events scheduled on DST transition dates with various TZ specifications; import.
  - Expected: Events appear at correct local times; ImportReport flags ambiguous entries and suggests user review. (Severity: Medium)

5. Injection vectors in description fields

  - Objective: ensure sanitized rendering prevents XSS or control char issues.
  - Steps: include VEVENT description fields with HTML, script tags, and control characters; import and open event details.
  - Expected: Rendered UI escapes or strips dangerous content; no script executes; raw text remains available in debug export if user requests. (Severity: High)

6. Interrupted import resume

  - Objective: validate checkpointing and resume without duplication.
  - Steps: begin large import, simulate browser crash or reload after a checkpoint, reopen app and resume import.
  - Expected: Import resumes from last checkpoint, no duplicate entries, ImportReport merges counts correctly. (Severity: Medium)

7. Storage quota / low disk handling

  - Objective: ensure graceful failure when `IndexedDB` storage is insufficient.
  - Steps: simulate near-quota conditions; run import until storage errors thrown.
  - Expected: Import aborts with clear user-facing error and partial rollback or safe checkpoint preserved for retry. (Severity: Medium)

8. Permission denial for Notifications (best-effort fallback)

  - Objective: ensure notifications logic degrades gracefully if permission denied.
  - Steps: deny Notification permission when prompted and enable reminders in settings.
  - Expected: App records preference, shows clear messaging, and continues without throwing errors. (Severity: Low)

9. Performance regression tests (CI)

  - Objective: add a CI harness to simulate imports (smaller scale) and assert parsing throughput does not regress.
  - Steps: run import of 2k events in CI environment using headless browser harness and measure wall time.
  - Expected: Throughput within acceptable baseline; alerts if regression > 10%. (Severity: Medium)

## Remediation & Monitoring Recommendations

- Add import metrics (counts, average duration, failure rates) behind opt-in telemetry.
- Capture sample failing entries (anonymized) to aid parser heuristics improvements.
- Add CI tests for malformed inputs and size benchmarks.

## Deliverables

- This threat model file (this document).
- A test-case checklist to include in the QA runbook.
- Optional: a small harness script to generate `.ics` files for tests (I can scaffold this if you want).

---

Generated by the `analyst` workflow to support implementation readiness and QA.
