# Planis

Planis est une application de gestion et planification disponible en version web et desktop.

## Structure du projet

```
Planis/
├── planis/              # Application web React/Vite
└── planis-electron/     # Application desktop Electron
```

## Démarrage rapide

### Application Web

```bash
cd planis
npm install
npm run dev
```

L'application sera disponible sur http://localhost:5173

### Application Desktop (Electron)

#### Prérequis
Assurez-vous d'avoir installé les dépendances des deux projets :

```bash
# Installer les dépendances de l'app web
cd planis
npm install

# Installer les dépendances Electron
cd ../planis-electron
npm install
```

#### Lancer en développement

```bash
cd planis-electron
npm run dev
```

Cela va :
1. Démarrer le serveur de développement Vite
2. Lancer l'application Electron qui se connecte au serveur

#### Build de production

```bash
cd planis-electron
npm run build
```

Les installeurs seront créés dans `planis-electron/release/`

## Technologies

### Application Web
- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **IndexedDB** (via idb) - Stockage local

### Application Desktop
- **Electron** - Framework desktop
- **TypeScript** - Typage statique
- Réutilise l'application web React

## Scripts disponibles

### Application Web (`planis/`)
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification du code

### Application Electron (`planis-electron/`)
- `npm run dev` - Mode développement
- `npm run build` - Build complet avec installeurs
- `npm run pack` - Package sans créer d'installeur

## Documentation

Pour plus de détails, consultez :
- [README de l'app web](./planis/README.md)
- [README Electron](./planis-electron/README.md)
