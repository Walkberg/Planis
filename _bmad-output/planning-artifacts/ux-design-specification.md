
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
lastStep: 14
workflowComplete: true
completedAt: 2026-02-03T00:00:00Z
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/architecture-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/prd-acceptance-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/prd-validation-Planis-2026-02-03.md
  - _bmad-output/planning-artifacts/import-threat-model-Planis-2026-02-03.md
---

# UX Design Specification Planis

**Author:** walkberg
**Date:** 2026-02-03

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

Planis est une web‑app locale (PWA possible) qui remet à l'utilisateur le contrôle total de son calendrier via un import `.ics` one‑time, stockage local (`IndexedDB`), vues jour/semaine/mois, édition riche et notifications locales. L'ambition MVP : migration simple + UX réactive pour que l'utilisateur retrouve immédiatement ses événements sans dépendre du cloud.

### Target Users

- Persona principal : utilisateurs privacy‑first et techniquement compétents (ex. Thomas) qui veulent migrer et contrôler leurs données localement.
- Secondaires : utilisateurs non‑techniques cherchant une alternative simple à Google Calendar — onboarding guidé recommandé.

### Key Design Challenges

- Import volumineux (`.ics` jusqu'à ~10k événements) sans bloquer l'interface — nécessité de Web Worker, parsing par chunks et feedback de progression.
- Récupération et résilience face à fichiers malformés — UX de partial‑import et actions de correction claires.
- Interactions complexes : DnD accessible au clavier et conforme WCAG AA — gestion du focus, labels, et état undo.
- Stockage et reprise d'état : écriture idempotente dans `IndexedDB`, checkpointing d'import, messages d'erreur compréhensibles.

### Design Opportunities

- Offrir un assistant d'import qui transforme l'acte technique (`.ics`) en expérience rassurante et visuelle (aperçu, erreurs, récupération). Cela devient le premier « aha ».
- Concevoir un pattern de DnD accessible (grille sémantique + interactions clavier) qui différencie Planis par qualité d'accessibilité.
- Proposer une workspace d'import/debug pour le support (export debug, samples), facilitant la résolution de tickets et améliorant la confiance.

---

Voici le résumé de découverte basé sur les documents chargés. Que souhaitez‑vous faire maintenant ?

- `A` : Advanced Elicitation (approfondir certains points)
- `P` : Party Mode (inviter perspectives multiples)
- `C` : Continuer vers l'étape 3 (je sauvegarde ce contenu dans le document et j'ouvre `step-03-core-experience.md`)

## Core User Experience

### Defining Experience

Le cœur de Planis est de permettre à l'utilisateur de reprendre le contrôle de son calendrier rapidement : importer un `.ics` et interagir immédiatement avec ses événements. L'action la plus fréquente sera la consultation et la modification rapide d'événements (création, déplacement via drag & drop, édition). La priorité UX est donc d'optimiser le flux import → découverte → édition.

### Platform Strategy

- Plateforme principale : Web SPA (Vite + React + TS), responsive pour desktop et mobile ; PWA possible pour notifications et intégration hors‑ligne.
- Interactions supportées : souris/tactile/clavier (accessibilité prioritaire). Offline-first via `IndexedDB` et Service Worker.

### Effortless Interactions

- Assistant d'import visuel (aperçu + corrections) pour transformer un fichier technique en expérience guidée.
- Création rapide d'événements : clic / double‑clic / drag & drop avec un panneau d'édition léger (inline → détaillé).
- Undo/Redo pour opérations critiques (import, suppression, déplacement) et confirmations non intrusives.

### Critical Success Moments

- Import initial réussi avec rapport clair (importedCount, failedCount) — premier « aha ».
- Déplacement d'un événement par drag & drop et pouvoir finaliser ses détails sans effort.
- Restauration/diagnostic simple via export debug si l'import rencontre des erreurs.

### Experience Principles

- Local‑first & Respectueux : les données restent sur l'appareil, communication claire sur confidentialité.
- Prévisible & Rassurant : l'import est expliqué, les erreurs sont visibles et réparables.
- Accessible par défaut : interactions DnD accessibles clavier+lecture d'écran, focus management soigné.
- Rapide & Réactive : opérations interactives <2s, import en arrière‑plan sans bloquer l'UI.

---

## Desired Emotional Response

### Primary Emotional Goals

- Confiance : l'utilisateur se sent maître de ses données et comprend ce que fait l'application.
- Soulagement / Apaisement : importer ses événements sans douleur, avec des messages clairs et non alarmistes.
- Accomplissement : après import et premières interactions, l'utilisateur ressent un véritable gain de productivité.

### Emotional Journey Mapping

- Découverte : curiosité et légère méfiance — rassurer via langage clair et transparence sur le stockage local.
- Import : anxiété potentielle — réduire par un assistant pas-à-pas, aperçu et rapport clair (imported/failed).
- Post‑import interaction : satisfaction et empowerment si les événements sont visibles et éditables immédiatement.
- Erreur / échec : montrer options de récupération et tester un geste d'autonomie (retry, debug export) pour éviter frustration.

### Micro-Emotions

- Confiance vs. Scepticisme (gérer par transparence)
- Soulagement vs. Anxiété (gérer par feedback progressif)
- Fierté / Accomplissement vs. Frustration (gérer par réussite rapide des tâches clés)

### Design Implications

- Ton et langage : utiliser un ton calme, descriptif et non technique lors de l'import et des erreurs.
- Feedback progressif : barres de progression, counts en temps réel, et messages contextualisés pour chaque étape.
- Empowerment actions : boutons clairs pour retry, partial recovery, et export debug pour support.
- Reduce cognitive load : masquer complexité par défaut, proposer options avancées pour utilisateurs experts.

### Emotional Design Principles

- Be Transparent: explain what is happening and why (import, storage, errors).
- Be Calm: avoid alarming language; use supportive, instructive prompts.
- Be Empowering: provide clear recovery and undo paths so users feel in control.
- Be Immediate: surface early wins (preview, first event visible) to generate momentum.

---
J'ai sauvegardé cette section dans le document.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

- Google Calendar / Apple Calendar / Outlook / Notion Calendar — onboarding and import UIs are familiar to many users; they make import straightforward but vary in clarity for recovery from errors.
- Fantastical — excellent quick-add and clear event presentation; strong immediate usefulness and delight for quick entry.
- Notion / Trello — workspace and card patterns demonstrate progressive disclosure and fast inline edits useful for complex info.

### Transferable UX Patterns

- Import Assistant with preview: show file summary, sample events, and allow selective inclusion/exclusion before committing.
- Progressive Disclosure: keep advanced options hidden by default, offer an "Expert" toggle for power users.
- Inline Quick-Edit & Undo: allow lightweight edits directly in calendar cells and provide immediate undo.
- Accessible DnD Grid: semantic calendar grid with keyboard drag/drop equivalents and careful focus management.
- Robust Progress & Recovery UI: batch progress, counts (imported/failed), and actions for partial-recovery.

### Anti-Patterns to Avoid

- Buried Errors: hiding failure details in logs without user-facing guidance increases frustration.
- Overly Technical Language: exposing raw parsing errors to non-technical users without guidance.
- Modal Overload: forcing deep modal flows for simple edits slows the core loop.

### Design Inspiration Strategy

- Adopt: Import Assistant + Accessible DnD + Inline Quick-Edit — align with core experience and emotional goals.
- Adapt: Fantastical's quick-add for a privacy-first, local-first context (client-side parsing only).
- Avoid: complex modal-heavy flows and technical jargon in error messages; prefer actionable recovery steps.

---

Je peux maintenant sauvegarder cette section et charger `step-06-design-system.md` si vous le souhaitez.

Que voulez‑vous faire maintenant ?

- `A` : Advanced Elicitation (approfondir certains points)
- `P` : Party Mode (inviter perspectives multiples)
- `C` : Continuer (je sauvegarde cette section dans le document et j'ouvre `step-06-design-system.md`)

## Design System Foundation

### 1.1 Design System Choice

Custom design system (Neo‑Brutalism) with Tailwind utilities for components — unique visual identity while keeping developer ergonomics via utility classes.

### Rationale for Selection

- Besoin d'une identité visuelle forte et reconnaissable → choix `custom`.
- Utiliser Tailwind permet d'accélérer l'implémentation des composants tout en gardant un contrôle fin sur le style.
- Facilite maintenance et thèmes via `tailwind.config.js` (design tokens centralisés).

### Implementation Approach

- Base: Tailwind CSS (utility-first) + custom component layer (réutilisable) pour patterns spécifiques (calendar grid, import assistant, event cards).
- Design tokens: définir couleurs, spacing, radii, typography dans `tailwind.config.js` sous `theme.extend`.
- Font: importer `Space Mono` via Google Fonts et appliquer comme font-display pour l'UI.
- Create a small `styles/base.css` that includes the font import and sets root variables for colors.

### Neo Brutalism Visual Tokens

- Background: `#FFFDE7`
- Accent / Primary: `#ff6b35`
- Accent / Secondary: `#00D9FF` (hover: `#00B8D9`)
- Accent / Tertiary: `#7B2FBE`
- Accent / Quaternary: `#F7931E`

### Example Tailwind config notes

- Extend the `colors` palette with the tokens above.
- Set `fontFamily: { mono: ['Space Mono', 'monospace'] }`.
- Add custom utilities or components for heavy, high-contrast borders and drop shadows to achieve neo‑brutalist aesthetic.

### Custom Component Guidance

- Buttons: strong rectangular forms, thick borders, high-contrast fills for primary actions (`#ff6b35`), secondary using `#00D9FF` with hover `#00B8D9`.
- Cards / Panels: flat surfaces with bold edge strokes, large padding, and clear hierarchy via color accents.
- Calendar grid: semantic grid with pronounced cell borders and accessible focus outlines.

---

Si vous voulez, je peux maintenant :

- Scaffolder `tailwind.config.js` + `styles/base.css` et un exemple de `Button` composant.
- Ou simplement enregistrer cette décision et passer à l'étape suivante.

Que préférez‑vous ? (répondez `scaffold` ou `suivant`)

## Defining Core Experience

### 2.1 Defining Experience

Le defining experience de Planis est : "Importer son calendrier puis modifier rapidement un événement via drag & drop et édition inline". Si cette boucle est fluide (import → aperçu → édition rapide), l'utilisateur ressentira maîtrise et valeur immédiate.

### 2.2 User Mental Model

- Les utilisateurs attendent que l'import restaure leurs événements tels qu'ils apparaissaient ailleurs (même ordre, titres et heures). Ils pensent en termes de jours/semaines et s'attendent à manipuler les événements directement sur la grille.
- Mental model clé : calendrier = grille temporelle; actions directes sur la grille (sélection, drag, drop, quick-edit).

### 2.3 Success Criteria

- Import visible et usable : premier événement visible dans l'UI < 5s après import (preview). 
- Drag & drop operable via souris et clavier, avec édition persistée à l'enregistrement (<2s perceived latency).
- Partial-import recovery: user can identify and correct failed entries via the import assistant.

### 2.4 Novel UX Patterns

- Inline Quick-Edit Card: small inline form anchored to cell after DnD or double-click, with primary fields and a link to full editor.
- Import Preview Selector: show sample events and allow toggling inclusion per-event-group (by date or source) before commit.

### 2.5 Experience Mechanics

1. Initiation: User uploads `.ics` via file picker or drag/drop onto import area; UI shows parsed summary instantly.
2. Interaction: Worker parses file and streams sample events to preview; user toggles groups to include/exclude and presses Commit.
3. Feedback: Progress bar, counts (imported/failed), and live preview update; errors surfaced with actions (Retry / Export Debug).
4. Completion: First visible events rendered; user can click/drag to edit — inline card appears to finalize details; Undo available for recent actions.

---

J'ai ajouté la définition de l'expérience au document. Je charge `step-08-visual-foundation.md` pour la suite.

## Visual Design Foundation

### Color System

- Background: `#FFFDE7` (page background)
- Primary (Accent): `#ff6b35`
- Secondary (Accent): `#00D9FF` — hover: `#00B8D9`
- Tertiary (Accent): `#7B2FBE`
- Quaternary (Accent): `#F7931E`

Semantic mapping suggestion:
- `--color-bg` = `#FFFDE7`
- `--color-primary` = `#ff6b35`
- `--color-accent` = `#00D9FF`
- `--color-accent-hover` = `#00B8D9`
- `--color-ink` = `#111827` (ensure readable text contrast)

### Typography

- Font: `Space Mono` (import via https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap)
- Apply as primary UI type: `font-family: 'Space Mono', monospace;` for headings and UI labels; use system sans fallback for long-form if needed.
- Type scale (suggestion): H1 32px, H2 24px, H3 18px, Body 16px, Small 14px.

### Spacing & Layout

- Base spacing unit: `8px` (use multiples for layout: 8 / 16 / 24 / 32)
- Grid: responsive single-column on small, 12-column fluid grid for desktop if needed for panels.
- Use generous padding on cards and panels to match neo‑brutalist heavy forms.

### Accessibility Considerations

- Verify text contrast on `#FFFDE7` background; prefer dark ink `#111827` for body text to meet WCAG AA.
- Interactive controls must have focus outlines and visible focus states (high-contrast border or outline using `--color-accent`).
- Buttons must have accessible names, keyboard operability, and 44x44px touch targets.

### Implementation Notes (Tailwind)

- In `tailwind.config.js` extend `theme.colors` with the tokens above and set `fontFamily.mono` to `['Space Mono','monospace']`.
- Provide CSS variables in `styles/base.css` for the semantic tokens and import the Google Font there.
- Add utilities for neo‑brutalist styles: thick borders (`ring-2` / `border-4`), high-contrast fills, and bold box-shadows.

---

J'ai ajouté la fondation visuelle au document. Si vous voulez, je peux maintenant scaffolder les fichiers Tailwind (`tailwind.config.js`, `styles/base.css`) et un exemple de composant (`Button.tsx`).

## Design Direction Decision

### Design Directions Explored

- Direction A — Neo‑Brutalist (heavy): Bold borders, high-contrast fills, pronounced grid, strong use of `#ff6b35` and `#7B2FBE` for accents; dense, emphatic UI.
- Direction B — Neo‑Brutalist (airy): Same brutalist tokens with more white space and softer shadows to improve readability on `#FFFDE7`.
- Direction C — Functional Minimal: Prioritize clarity and performance; restrained accents (`#00D9FF`) with focus on quick-add and inline edits.

### Chosen Direction (proposal)

- Recommend starting with **Direction B (Neo‑Brutalist Airy)**: preserves the bold identity while improving legibility and accessibility on the chosen background.

### Design Rationale

- Balances the unique visual identity you requested with the practical needs of a calendar app (readability, scanability, and accessibility).
- Supports emotional goals (confidence, calm) by using softer spacing and clear feedback while keeping the brand punch through accents.

### Implementation Approach

- Create HTML design direction showcase for quick comparison at `_bmad-output/planning-artifacts/ux-design-directions.html` when you ask me to generate it.
- Implement the chosen direction as a Tailwind theme with component variants for Buttons, Cards, Calendar Grid, and Import Assistant.

---

J'ai sauvegardé cette décision dans le document et je charge `step-10-user-journeys.md` pour la suite.

## User Journey Flows

### Journey 1 — Onboarding & `.ics` Import (Primary)

Description: User imports a `.ics` during onboarding to migrate calendar data and expects a clear preview, progress feedback, and recovery for malformed entries.

Mermaid diagram:

```mermaid
flowchart TD
  A[Start: Open Import] --> B[Select .ics or drag/drop]
  B --> C{File accepted?}
  C -- No --> C1[Show error: invalid file]
  C1 --> B
  C -- Yes --> D[Start Worker parse]
  D --> E[Stream preview sample events]
  E --> F[User reviews preview]
  F --> G{User commits selection?}
  G -- No --> H[Adjust selection / exclude groups]
  H --> F
  G -- Yes --> I[Commit → Worker writes batches]
  I --> J[Progress updates & ImportReport]
  J --> K{Failures?}
  K -- Yes --> L[Show failed entries + Recovery actions (retry/export debug)]
  K -- No --> M[Render first events, show success]
  M --> Z[End]
```

Success criteria:
- Preview visible within 5s on target device.
- Import completes without blocking UI; progress visible.
- User can recover or export debug for failed entries.

---

### Journey 2 — Create/Edit Event (Drag & Drop → Inline Edit)

Description: User creates or moves an event directly on the calendar grid and finalizes details via an inline quick-edit card.

Mermaid diagram:

```mermaid
flowchart TD
  A[Start on Calendar View] --> B[User drags from empty cell or selects event]
  B --> C{Drag or click?}
  C -- Drag --> D[Place event → show Inline Quick-Edit]
  C -- Click --> E[Open Inline Quick-Edit]
  D --> F[User edits primary fields (title/time)]
  E --> F
  F --> G{Save or Cancel}
  G -- Save --> H[Persist to IndexedDB (fast write)]
  H --> I[Show toast + Undo option]
  G -- Cancel --> J[Revert visual move]
  I --> Z[End]
```

Success criteria:
- Drag & drop + inline edit complete and persisted with perceived latency <2s.
- Keyboard accessible equivalents exist for DnD and inline editing.
- Undo available for recent changes.

---

### Journey 3 — Support & Debug (Export Debug)

Description: When import fails or user reports missing events, support flow provides an exportable debug package and clear steps for recovery.

Mermaid diagram:

```mermaid
flowchart TD
  A[User reports issue] --> B[Open Support / Diagnostics]
  B --> C[Generate ImportReport + sample failed entries]
  C --> D{Include full payload?}
  D -- No --> E[Generate sanitized debug export]
  D -- Yes --> F[Generate full debug export (user consent)]
  E --> G[Provide download / share instructions]
  F --> G
  G --> H[Support reviews and suggests retry or fixes]
  H --> Z[End]
```

Success criteria:
- Support can obtain actionable debug data without exposing PII by default.
- User guided through retry or partial-recovery steps.

---

### Journey Patterns

- Entry points: file picker, drag/drop, keyboard shortcuts — support all.
- Progressive disclosure: show minimal info by default, allow advanced options for power users.
- Idempotent writes and checkpointing for import resume.

### Flow Optimization Principles

- Minimize steps to first value (preview, first event visible quickly).
- Provide immediate, human‑readable feedback for failures with clear recovery actions.
- Ensure all interactive flows have keyboard and screen‑reader accessible alternatives.

Que voulez‑vous faire ensuite ?

- `A` : Advanced Elicitation (approfondir ces parcours)
- `P` : Party Mode (inviter perspectives multiples)
- `C` : Continuer — je sauvegarde ces parcours dans le document et charge `step-11-component-strategy.md`

## Component Strategy

### Design System Components

Using the chosen approach (Custom + Tailwind), foundation components come from Tailwind utilities. We'll rely on Tailwind for low-level utilities and implement a small component layer for reusable UI primitives (Button, Card, Input, Modal, Badge).

### Custom Components (needed)

- `CalendarGrid` — semantic grid, accessible cells, keyboard drag/drop handlers, focus management.
- `ImportAssistant` — file drop area, preview list, commit controls, progress UI, recovery actions.
- `InlineQuickEdit` — compact editor anchored to a grid cell for quick edits with Save/Cancel and keyboard support.
- `EventCard` — summary view for events with variants for small/large and status badges.
- `NotificationBadge` / `Toast` — transient messages with undo actions.
- `DebugExport` — support utility to generate sanitized debug packages.

### Component Specifications (summary)

#### `Button`
**Purpose:** Primary action surface.
**Variants:** primary (`#ff6b35`), secondary (`#00D9FF`), ghost.
**States:** default, hover, active, focus, disabled.
**Accessibility:** `aria-pressed` where applicable, keyboard focus, 44x44 minimum target.

#### `CalendarGrid`
**Purpose:** Display time cells and events.
**Anatomy:** grid, cell, event element, grid header.
**States:** empty, occupied, selected, focused, drag-over.
**Accessibility:** ARIA grid roles, keyboard navigation (arrow keys), drag/drop fallbacks.

#### `ImportAssistant`
**Purpose:** Guide `.ics` import and recovery.
**Features:** file validation, streaming preview, include/exclude toggles, commit, progress bar, error list.
**Accessibility:** descriptive labels, progress semantics, error summaries linked to items.

### Component Implementation Strategy

- Build components as React + TypeScript function components in `src/components`.
- Use Tailwind for styling; extract common classes into small `ui/*` component wrapper utilities.
- Expose props for accessibility hooks (id, aria labels, keyboard handlers).
- Document each component with Storybook stories and include accessibility checks (axe).

### Implementation Roadmap

**Phase 1 - Core (MVP):** `Button`, `Input`, `Toast`, `CalendarGrid (basic)`, `InlineQuickEdit`, `ImportAssistant (preview + commit)`.

**Phase 2 - Polishing:** `EventCard` variants, `DebugExport`, improved keyboard DnD, accessibility testing and fixes.

**Phase 3 - Enhancements:** performance tuning for large imports, animations, additional component variants.

---

J'ai ajouté la stratégie de composants au document. Voulez‑vous :

- `A` Advanced Elicitation — approfondir les specs composants
- `P` Party Mode — solliciter perspectives techniques
- `C` Continuer — sauvegarder et charger `step-12-ux-patterns.md`

## UX Consistency Patterns

### Analyse succincte

Les patterns critiques pour Planis (priorité haute) :
- Hiérarchie des boutons
- Patterns de feedback (toasts, inline, summary)
- Formulaires et validation
- Navigation (views / filters)
- Modales / overlays
- États vides et chargement
- Recherche & filtrage

Ces patterns doivent garantir : cohérence visuelle via les tokens Tailwind, conformité WCAG AA, et comportements mobiles/desktop cohérents.

### Patterns définis (résumé)

#### Button Hierarchy
**Quand :** actions primaires/secondaires (import, commit, undo).
**Visuel :** primaire = `--color-primary` (#ff6b35), secondaire = outline `--color-accent` (#00D9FF), ghost = transparent.
**Comportement :** états hover/active/focus distincts, spinner pour actions longues.
**Accessibilité :** 44×44 min., `aria-label`, focus visible.

#### Feedback Patterns
Toasts avec option `Undo` pour actions critiques ; erreurs d'import affichées en liste avec actions (retry/export debug) ; inline validation pour formulaires.
Use `role="status"` et `role="alert"` selon le contexte.

#### Form Patterns
Inline validation + summary d'erreurs. Mobile : single-column, large touch targets, progressive disclosure pour options avancées.

#### Navigation Patterns
Vue principale (Jour/Semaine/Mois), filtres persistants, import et support accessibles depuis la barre principale. URL reflecte l'état pour deep‑links.

#### Modal & Overlay Patterns
Favoriser l'inline quick-edit ; si modale, trap focus, accessible et dismissible.

#### Empty & Loading States
Actionable empty states avec CTA clair (importer, données d'exemple). Skeletons pour la grille, progress bar pour import.

#### Search & Filtering
Recherche incrémentale (debounce), chips filtrants, état des filtres sauvegardé, résultats accessibles au clavier.

### Intégration technique
- Mapper chaque pattern sur un composant Tailwind + wrapper React (ex. `<Button variant="primary" />`).
- Documenter chaque pattern dans Storybook avec exemples visuels, snippets et checklist A11y.

### Documentation (template)
Pour chaque pattern inclure : `When to use`, `Visual`, `Behavior`, `Accessibility`, `Mobile considerations`, `Variants`, `Implementation notes`.

---

J'ai ajouté ces patterns au document. Que voulez‑vous faire maintenant ?

- `A` : Advanced Elicitation — approfondir ces patterns
- `P` : Party Mode — solliciter perspectives multiples
- `C` : Continuer — je sauvegarde ces patterns et je charge `step-13-responsive-accessibility.md`
 
## Responsive Design & Accessibility

### Analyse (résumé)

Le produit doit fonctionner de manière fiable et accessible sur mobile, tablette et bureau. Les priorités sont : mobile-first pour les interactions critiques (import, preview, édition rapide), breakpoints clairs pour repenser l'utilisation de l'espace, et conformité WCAG AA. Les décisions visuelles (Direction B) impactent les contrastes et la gestion des focus — vérifier ratios de contraste et tailles cibles.

### Responsive Strategy

- Mobile-first : prioriser les chemins critiques (import preview, quick-edit) en single-column.
- Tablet : interface tactile optimisée, gestuelles simplifiées, densité d'information modérée.
- Desktop : utiliser espace horizontal pour panneau d'import / aperçu côte-à-côte, multi-column pour tableaux et diagnostics.

### Breakpoint Strategy

- Mobile: up to 767px — single column, bottom-friendly CTAs.
- Tablet: 768px–1023px — two-column behaviors for preview + editor.
- Desktop: 1024px+ — multi-column layouts, side panels, denser grids.
- Utiliser breakpoints Tailwind standards et ajuster si besoin pour cas critiques (ex. large calendar grid).

### Accessibility Strategy

- Cible de conformité : WCAG AA minimum.
- Points clefs : contraste texte/background >= 4.5:1, focus visibles, keyboard operability for DnD fallbacks, ARIA roles pour grid et live regions, semantic HTML.
- Touch targets >= 44×44px, skip-links pour navigation rapide, option high-contrast mode.

### Testing Strategy

- Automatisé : axe-core, Lighthouse accessibility audits dans CI.
- Manuel : keyboard-only flows, screen reader tests (VoiceOver, NVDA), color-blindness checks.
- Device testing : on real devices (iOS/Android) and common browsers (Chrome, Firefox, Safari, Edge).

### Implementation Guidelines

- Mobile-first CSS, use `rem` and responsive utilities in Tailwind.
- Semantic markup for calendar grid (`role="grid"`, `role="gridcell"`) and proper labeling.
- Expose focus management hooks in components (e.g., `onFocusRestore`) and document keyboard patterns for DnD.
- Ensure progress and status elements use ARIA roles (`role="progressbar"`, `aria-live="polite"`).

---

J'ai préparé et ajouté la section "Responsive Design & Accessibility" au document. Que voulez‑vous faire maintenant ?

- `A` : Advanced Elicitation — approfondir la stratégie responsive/accessibilité
- `P` : Party Mode — solliciter perspectives multiples
- `C` : Continuer — sauvegarder ce contenu et charger `step-14-complete.md`



