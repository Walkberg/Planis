# Features

Organisation de la logique métier de l'application Planis par features, chaque feature ayant son propre provider.

## Structure

```
features/
├── calendar/
│   └── providers/
│       └── CalendarProvider.tsx    # Gestion de la date, vues, navigation
├── events/
│   └── providers/
│       └── EventsProvider.tsx      # Gestion des événements (CRUD)
├── interactions/
│   └── providers/
│       └── DragInteractionProvider.tsx  # Gestion drag & drop, resize
└── providers/
    └── AppProviders.tsx            # Composition de tous les providers
```

## Providers

### CalendarProvider
Gère l'état et la logique du calendrier:
- Navigation entre les dates
- Calcul des jours affichés (1, 3 ou 7 jours)
- Génération du calendrier mensuel
- Utilitaires de comparaison de dates

### EventsProvider
Gère l'état et la logique des événements:
- Liste des événements
- CRUD des événements (Create, Read, Update, Delete)
- Sélection d'événement
- Calcul du positionnement des événements dans la vue

### DragInteractionProvider
Gère les interactions utilisateur:
- Création d'événement par drag & drop
- Redimensionnement d'événements
- États de drag en cours

## Usage

Les providers sont automatiquement wrappés autour de l'application via `AppProviders`:

```tsx
import { AppProviders } from './features/providers/AppProviders';

<AppProviders>
  <CalendarApp />
</AppProviders>
```

Dans les composants, utilisez les hooks correspondants:

```tsx
import { useCalendar } from './features/calendar/providers/CalendarProvider';
import { useEvents } from './features/events/providers/EventsProvider';
import { useDragInteraction } from './features/interactions/providers/DragInteractionProvider';

function MyComponent() {
  const { currentDate, setCurrentDate } = useCalendar();
  const { events, addEvent } = useEvents();
  const { handleMouseDown } = useDragInteraction();
  
  // ...
}
```
