# Planis Electron

Application desktop pour Planis construite avec Electron.

## Structure

```
planis-electron/
├── app/                    # Code source Electron
│   ├── main.ts            # Process principal
│   └── preload.ts         # Script preload
├── dist-electron/          # Code compilé (ignoré)
├── release/               # Builds de production (ignoré)
└── package.json
```

## Développement

### Prérequis

Assurez-vous que l'application React (dans le dossier `planis`) est prête.

### Installation

```bash
npm install
```

### Lancer en mode développement

```bash
npm run dev
```

Cette commande va :
1. Démarrer le serveur de développement Vite (port 5173)
2. Attendre que le serveur soit prêt
3. Lancer l'application Electron

### Build de production

```bash
npm run build
```

Cela va créer un installeur dans le dossier `release/`.

## Scripts disponibles

- `npm run dev` - Lance l'app en mode développement
- `npm run build` - Crée un build de production complet
- `npm run build:renderer` - Build uniquement l'app React
- `npm run build:electron` - Compile uniquement le code TypeScript Electron
- `npm run pack` - Crée un package non distribué (pour test)
- `npm run dist` - Crée les installeurs de distribution

## Configuration

La configuration de build est dans `package.json` sous la clé `build`.

### Icônes

Placez vos icônes dans le dossier `resources/`:
- `icon.ico` pour Windows
- `icon.icns` pour macOS
- `icon.png` pour Linux (512x512 recommandé)
