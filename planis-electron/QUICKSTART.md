# 🚀 Guide de démarrage rapide - Planis Electron

## Installation initiale

### 1. Installer les dépendances de l'application web

```bash
cd planis
npm install
```

### 2. Installer les dépendances Electron

```bash
cd ../planis-electron
npm install
```

## Lancer l'application desktop

### Mode développement

Depuis le dossier `planis-electron` :

```bash
npm run dev
```

Cette commande va automatiquement :
✅ Démarrer le serveur Vite (port 5173)
✅ Attendre que le serveur soit prêt
✅ Lancer l'application Electron avec les DevTools

### Tester le build de production

```bash
npm run pack
```

Cela crée un package non distribué dans `release/` pour tester l'app en mode production sans créer d'installeur complet.

### Créer l'installeur final

```bash
npm run build
```

L'installeur sera disponible dans `planis-electron/release/`

## Structure des fichiers

```
planis-electron/
├── app/
│   ├── main.ts          # Process principal Electron
│   └── preload.ts       # Script de preload (sécurité)
├── resources/           # Icônes de l'application
├── dist-electron/       # Code compilé (généré)
└── release/            # Builds de production (généré)
```

## Personnalisation

### Changer les icônes

Placez vos icônes dans `resources/` :
- `icon.ico` pour Windows (256x256)
- `icon.icns` pour macOS
- `icon.png` pour Linux (512x512)

### Configuration de build

Modifiez la section `build` dans `package.json` pour ajuster :
- Le nom de l'application
- L'appId
- Les cibles de build (NSIS, DMG, AppImage, etc.)
- La catégorie de l'app

## Problèmes courants

### Le port 5173 est déjà utilisé

Si vous avez déjà un serveur Vite qui tourne, arrêtez-le avant de lancer `npm run dev`.

### L'application ne démarre pas

Vérifiez que :
1. Les dépendances sont installées dans les deux dossiers (`planis` et `planis-electron`)
2. Le code TypeScript compile sans erreur : `npm run build:electron`

## Prochaines étapes

- [ ] Ajouter vos icônes personnalisées dans `resources/`
- [ ] Tester le build sur votre plateforme (`npm run pack`)
- [ ] Configurer l'auto-update (electron-updater est déjà installé)
- [ ] Personnaliser la fenêtre (taille, frame, etc.) dans `app/main.ts`

---

Pour plus d'infos, consultez le [README complet](./README.md).
