
---
stepsCompleted: [1, 2, 3, 4, 5]
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

- Google Calendar / Apple Calendar / Outlook — onboarding and import UIs are familiar to many users; they make import straightforward but vary in clarity for recovery from errors.
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


