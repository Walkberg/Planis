import React, { useEffect, useState, type ReactNode } from 'react';
import { CalendarProvider } from '../calendar/providers/CalendarProvider';
import { EventsProvider } from '../events/providers/EventsProvider';
import { DragInteractionProvider } from '../interactions/providers/DragInteractionProvider';
import { ConfigProvider } from '../configs/providers/ConfigProvider';
import { storageProvider } from '../../storage/IndexedDBStorageProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      try {
        await storageProvider.initialize();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDB();
  }, []);

  if (!dbInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-neo-yellow">
        <div className="text-2xl font-bold">Chargement...</div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <CalendarProvider>
        <EventsProvider>
          <DragInteractionProvider>{children}</DragInteractionProvider>
        </EventsProvider>
      </CalendarProvider>
    </ConfigProvider>
  );
};

