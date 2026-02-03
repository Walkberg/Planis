---
stepsCompleted: [1, 2, 3, 4]
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
lastStep: 4
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

