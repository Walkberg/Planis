---
stepsCompleted: [1, 2, 3, 4, 5, 6]
lastStep: 6
completed: true
completedAt: 2026-02-03T12:00:00Z
inputDocuments: []
date: 2026-02-03
author: walkberg
---

# Product Brief: Planis

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

Planis est une application de calendrier web locale destinée aux personnes et organisations qui refusent d'utiliser des services en ligne (ex. Google Calendar). Elle permet d’importer l’ensemble d’un calendrier en local (import .ics one‑time), de gérer événements avancés (récurrences, templates, drag & drop, vues jour/semaine/mois) et de recevoir des notifications locales. Les données sont stockées uniquement dans le navigateur (`IndexedDB`) ; la synchronisation entre appareils est manuelle (export/import). MVP visé : 1 semaine.

---

## Core Vision

### Problem Statement

De nombreuses personnes souhaitent conserver la maîtrise de leurs calendriers sans dépendre de services cloud centralisés — pour des raisons de vie privée, d'accessibilité hors‑ligne ou de simple préférence personnelle — mais les solutions locales sont soit rudimentaires, soit difficiles à utiliser.

### Problem Impact

- Perte de contrôle et dépendance aux fournisseurs cloud.
- Risque d'exposition de données personnelles pour les utilisateurs soucieux de confidentialité.
- Friction pour les utilisateurs hors‑ligne ou avec contraintes réseau.
- Solutions existantes locales manquent de fonctionnalités avancées attendues (récurrence, templates, import simple).

### Why Existing Solutions Fall Short

- Google/Outlook offrent puissantes fonctionnalités mais centralisent les données.
- Apps locales souvent limitées en UX et en import/export, ou nécessitent installation lourde.
- Synchronisation automatique exige confiance dans un service externe.

### Proposed Solution

Une web app locale (PWA possible plus tard) qui :
- Stocke tout en `IndexedDB` côté client.
- Permet import `.ics` one‑time (migration facile depuis d'autres calendriers).
- Offre vues jour/semaine/mois, création/édition avancée, récurrences, templates, drag & drop et recherche.
- Notifications via navigateur locales.
- Pas de chiffrement ni verrou d’accès initial (option future).
- Basée sur la structure du repo `planis` (Vite + React + TS) mais ré-implémentée depuis zéro pour respecter vos choix.

### Key Differentiators

- Local-first : toutes les données restent sur l'appareil — pas de service cloud par défaut.
- Import facilité : import .ics simple pour migration rapide.
- UX moderne attendue d’une app web (drag & drop, templates) sans nécessiter d'installation native (PWA ultérieurement).
- Rapide MVP en 1 semaine ciblant privacy-first users.

## Target Users

### Primary Users

- **Persona:** Thomas — 50 ans, développeur.
	- Contexte : Utilise des outils locaux, se méfie des géants cloud, veut garder la maîtrise de ses données.
	- Objectifs : Enregistrer événements classiques (sport, rendez‑vous), catégoriser par activités, gérer tâches liées à projets en cours.
	- Frictions actuelles : Tout est stocké sur internet; perte de contrôle et inquiétude sur l’usage des données par Google; solutions locales manquent de fonctionnalités avancées.
	- Succès : Pouvoir gérer à la fois événements et tâches de projet localement, organiser par catégories, importer facilement son historique (.ics) et recevoir des notifications locales.

### Secondary Users

- **Segment suggéré (à confirmer):** Utilisateurs privacy‑first non‑techniques qui veulent une alternative simple à Google Calendar — peut nécessiter onboarding guidé et templates.

### User Journey (résumé)

- **Discovery:** Bouche à oreille dans communautés privacy / OSS / amis.
- **Onboarding:** Import .ics one‑time pour migrer, création de catégories et projets via un assistant/template.
- **Core Usage:** Ajout/édition d’événements et tâches, catégorisation, vues jour/semaine/mois, utilisation de templates pour événements récurrents.
- **Aha moment:** Après import, tout est visible et modifiable hors‑ligne avec notifications locales — l’utilisateur sent qu’il contrôle ses données.
- **Long term:** Utilisation régulière, sauvegardes/export manuelles, possible adoption de PWA/Electron pour intégration plus native.

## MVP Scope

### Core Features

- Import `.ics` one‑time pour migrer un calendrier existant.
- Création d'événements par clic dans le calendrier et édition complète des champs.
- Drag & drop pour déplacer/durer un événement et compléter ses informations après déplacement.
- Création et affichage de tâches qui apparaissent dans le calendrier et peuvent être reliées à des activités/projets.
- Vues : 1 jour, 3 jours, 1 semaine, 1 mois, et une vue dédiée aux tâches planifiées.
- Édition d'événements existants (modification, suppression).
- Événements récurrents avancés : yearly, monthly by rule (chaque x du mois), weekly patterns (tous les mercredis), etc.
- Notifications locales via navigateur.

### Out of Scope (MVP)

- Synchronisation automatique entre appareils (seulement export/import manuel pour MVP).
- Chiffrement des données et gestion avancée des accès (option pour versions futures).
- Synchronisation cloud ou compte utilisateur centralisé.
- Intégrations bidirectionnelles en temps réel avec d'autres calendriers.

### MVP Success Criteria

- Fonctionnalité principale : un utilisateur peut importer un `.ics`, voir ses événements et ajouter/modifier des événements et tâches via l'interface.
- Qualitatif : l'utilisateur ressent qu'il contrôle ses données sans dépendre d'un service cloud.
- KPI déjà définis : DAU quotidien, 50 utilisateurs actifs en 30 jours, 10% complètent l'import `.ics`.

### Future Vision (post‑MVP)

- Packaging en Electron pour intégration native et notifications système.
- Option de chiffrement local et import/export chiffré.
- Synchronisation locale sur réseau LAN et option cloud chiffrée en opt‑in.

## Success Metrics

### User Success
- Comportement clé : utilisation quotidienne — l'utilisateur ouvre et utilise l'app chaque jour.
- Indicateur : DAU (utilisateurs actifs quotidiens) mesuré par ouverture de l'app.

### Fréquence cible
- Objectif d'utilisation pour le MVP : quotidien.

### Business Objective (MVP)
- KPI principal : 50 utilisateurs actifs dans les 30 premiers jours.

### Import `.ics` KPI
- Indicateur d'adoption : 10% des nouveaux utilisateurs complètent l'import `.ics` lors de l'onboarding.

### Période cible
- Horizon pour ces KPIs : 30 jours.


