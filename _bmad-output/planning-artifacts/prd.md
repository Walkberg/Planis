---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
inputDocuments:
	- _bmad-output/planning-artifacts/product-brief-Planis-2026-02-03.md
workflowType: 'prd'
date: 2026-02-03
author: walkberg
createdAt: 2026-02-03T12:05:00Z
documentCounts:
	productBriefs: 1
	research: 0
	brainstorming: 0
	projectDocs: 0
lastStep: 7
classification:
  projectType: "Web app"
  domain: "Productivity/Calendar"
  complexity: "Medium"
  projectContext: "greenfield"
---

# Product Requirements Document - Planis

**Author:** walkberg
**Date:** 2026-02-03

## Success Criteria

### User Success

- Instant "aha": import `.ics` complété et création d’un événement via drag & drop.
- Mesures proposées : 10% des nouveaux utilisateurs complètent l'import `.ics` durant l'onboarding; cible ≈ 3 créations d’événements actives/utilisateur/jour.

### Business Success

- KPI principal : DAU = 50 utilisateurs actifs dans les 30 premiers jours.
- KPI secondaire : 10% des nouveaux utilisateurs effectuent l'import `.ics` pendant l'onboarding.

### Technical Success

- Navigateurs supportés : Chrome, Edge, Firefox, Safari (versions récentes).
- Fonctionnement offline via `IndexedDB`.
- Traitement d'import `.ics` jusqu'à ~10k événements sans blocage UI.
- Notifications locales fonctionnelles sur plateformes supportées.

### Measurable Outcomes

- Taux d'import `.ics` en onboarding ≥ 10%.
- Moyenne de créations d'événements/utilisateur/jour ≥ 3.
- Temps de traitement d'un import de 10k événements < 10s (non bloquant).

## Product Scope

### MVP - Minimum Viable Product

- Import `.ics` one‑time
- Création/édition d'événements (UI complète)
- Drag & drop pour déplacer/modifier événements
- Vues : jour / semaine / mois
- Événements récurrents basiques
- Notifications locales

### Growth Features (Post‑MVP)

- Templates d'événements avancés
- Règles de récurrence avancées
- Packaging PWA / Electron pour intégration native

### Vision (Future)

- Option de synchronisation chiffrée opt‑in et chiffrement local des exports
- Intégrations bi‑directionnelles avec autres calendriers (opt‑in)

## User Journeys

### 1) Primary user — Thomas (Success)

- Opening: Thomas importe son `.ics` après installation et retrouve immédiatement ses événements.
- Rising action: Il crée un événement via drag & drop pour planifier une réunion.
- Climax: L'import affiche tous les événements ; il modifie un événement récurrent et tout se met à jour sans erreur.
- Resolution: Thomas utilise l'app quotidiennement et se sent maître de ses données.
- Exigences révélées: import `.ics` fiable, UI drag & drop réactive, gestion des récurrences, notifications locales.

### 2) Primary user — Edge case (Import volumineux / erreurs)

- Opening: Un utilisateur importe un `.ics` très volumineux (≥10k événements).
- Rising action: L'import démarre ; l'UI reste réactive grâce au traitement en arrière-plan.
- Climax: L'import contient des erreurs ; l'app propose correction/filtrage et retry.
- Resolution: L'utilisateur récupère la majorité des événements ; erreurs expliquées clairement.
- Exigences révélées: traitement asynchrone, barre de progression, validation & recovery, limites d'import.

### 3) Support / Troubleshooting

- Opening: Un utilisateur contacte le support pour un événement manquant après import.
- Rising action: Le support demande un export debug et guide l'utilisateur pour reproduire.
- Climax: Le support identifie un `.ics` mal formé et propose un import avec nettoyage automatique.
- Resolution: Ticket résolu ; heuristics d'import mises à jour.
- Exigences révélées: outils d'export/debug, capture de logs, UI de recovery, documentation support.

### 4) Admin / Power user (Backup & export)

- Opening: Un power user souhaite sauvegarder localement et exporter son calendrier chiffré.
- Rising action: Il lance l'export, choisit format (.ics) et options de chiffrement.
- Climax: Export complet ; fichier téléchargeable et vérifiable.
- Resolution: Utilisateur conserve une sauvegarde et peut restaurer facilement.
- Exigences révélées: export/import robuste, gestion de la taille d'export, option de chiffrement, flow de restauration.

### Journey Requirements Summary

- Couverture minimale : onboarding import fiable, UI drag & drop réactive, import asynchrone avec progress, validation et recovery, outils de support, export/restore simple.
- Ces parcours révèlent exigences fonctionnelles et non‑fonctionnelles qui guideront le découpage MVP et les priorités techniques.

## Domain-Specific Requirements

Based on classification (`Productivity/Calendar`, complexity: Medium) and your answers:

### Compliance & Regulatory

- No additional regulations required (confirmed: none).

### Integration & Data Flow

- Import model: one‑time `.ics` import only (no CalDAV or continuous sync required for MVP).
- Export: simple `.ics` export/backup supported; optional encrypted export is a future feature.

### Technical Constraints

- Storage: local storage via `IndexedDB` (no mandatory encryption at rest per user confirmation).
- Import performance target: handle imports up to ~10k events; aim for processing < 10s without blocking the UI (use background/streaming processing).
- Support modern browsers (Chrome, Edge, Firefox, Safari) and offline usage.

### Risk & Mitigations

- Risk: Very large imports may exceed device memory or CPU limits — mitigate via chunked/streaming parsing and progress UI.
- Risk: Malformed `.ics` files — mitigate via validation, heuristics, and a recovery UI with partial import and user-facing error explanations.

### When to skip deep domain work

- Domain step considered complete for medium complexity: no regulatory compliance needed and integrations limited to one‑time `.ics` import; proceed to innovation step.

---

## Project-Type Specific Requirements (Web app)

### Project-Type Overview

- Project type: **Web app (SPA)** — single-page application served to browsers with client-side routing and progressive enhancement for offline use.
- SEO: Not required for MVP.
- Real-time: Notifications for upcoming events required (browser Notification API); no full real-time collaboration needed for MVP.
- Accessibility: Target **WCAG AA** for core flows.

### Technical Architecture Considerations

- Client: SPA with client-side routing, responsive design, and accessibility-first components.
- Offline & Storage: Service Worker + `IndexedDB` for offline data and migration/import state; background sync or retries for long-running imports.
- Import processing: Use Web Workers or streaming/chunked parsing to handle `.ics` imports up to ~10k events without blocking the UI; show progress and recovery options.
- Notifications: Browser Notification API and the Permissions API; graceful fallback if notifications are denied.
- Performance: Code-splitting, lazy-loading routes and calendar views, keep initial payload minimal; performance targets to keep interactive time-to-first-draw under 1s on typical desktops.

### Implementation Considerations

- Routing & State: Use a robust router and client-state solution (lightweight store or React context) to manage event editing flows and offline queues.
- Parsing & Validation: Implement resilient `.ics` parser with validation and heuristics to salvage malformed entries; provide partial-import UX.
- Accessibility: Semantic markup, ARIA roles for calendar grid, keyboard navigation for drag/drop and event creation, focus management for dialogs and forms.
- Browser Support: Chrome, Edge, Firefox, Safari (recent versions); test on desktop and mobile browsers.
- Security: Least-privilege permission requests (notifications), sanitize imported data before rendering, avoid remote code execution vectors.

### Required Sections to Document

- `platform_reqs` (browser support, offline capabilities)
- `performance_targets` (import handling, UI responsiveness)
- `accessibility_requirements` (WCAG AA checkpoints for MVP)
- `notification_model` (permissions, fallback behavior)
- `import_validation` (parsing, error handling, recovery)

---


