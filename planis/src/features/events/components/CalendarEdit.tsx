import { useEffect, useRef, useState } from "react";
import { useEvents } from "../providers/EventsProvider";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { ConfigSelector } from "./ConfigSelector";
import { DynamicFieldsRenderer } from "./DynamicFieldsRenderer";

import { ColorPicker } from "../../../components/ui/ColorPicker";

// const DEFAULT_COLORS = ["#ff6b35", "#00D9FF", "#7B2FBE", "#F7931E"];

export const CalendarEdit = () => {
  const { selectedEvent, setSelectedEvent, updateEvent, deleteEvent } =
    useEvents();
  const { configs } = useConfig();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const previousEventIdRef = useRef<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<
    (typeof configs)[0] | null
  >(null);

  useEffect(() => {
    if (selectedEvent) {
      const config = configs.find((c) => c.id === selectedEvent.eventConfigId);
      setCurrentConfig(config || null);

      if (
        titleInputRef.current &&
        previousEventIdRef.current !== selectedEvent.id
      ) {
        titleInputRef.current.focus();
        previousEventIdRef.current = selectedEvent.id;
      }
    } else {
      previousEventIdRef.current = null;
    }
  }, [selectedEvent, configs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEvent) return;

      if (e.key === 'Delete') {
      
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
          deleteEvent();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedEvent, deleteEvent]);

  const handleClose = () => {
    setSelectedEvent(null);
  };

  const handleConfigChange = (configId: string) => {
    const newConfig = configs.find((c) => c.id === configId);
    if (!newConfig || !selectedEvent) return;

    setCurrentConfig(newConfig);

    const defaultCustomFields: Record<string, any> = {};
    newConfig.fieldConfigs.forEach((field) => {
      if (field.defaultValue !== undefined) {
        defaultCustomFields[field.key] = field.defaultValue;
      }
    });

    updateEvent({
      eventConfigId: configId,
      color: newConfig.color,
      isAllDay: newConfig.isAllDay,
      customFieldsValues: defaultCustomFields,
    });
  };

  const handleCustomFieldChange = (key: string, value: any) => {
    if (!selectedEvent) return;

    const updatedValues = {
      ...selectedEvent.customFieldsValues,
      [key]: value,
    };

    updateEvent({ customFieldsValues: updatedValues });
  };

  if (!selectedEvent) return null;

  return (
    <div className="w-80 bg-white border-l-4 border-black p-5 overflow-y-auto">
      <div className="bg-neo-purple border-4 border-black p-4 mb-5 shadow-neo-lg rounded-xl text-white">
        <h3 className="m-0 text-xl font-bold uppercase">Éditer l'événement</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Titre
          </label>
          <input
            ref={titleInputRef}
            type="text"
            value={selectedEvent.title}
            onChange={(e) => updateEvent({ title: e.target.value })}
            placeholder="Entrez le titre de l'événement..."
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>
        <ConfigSelector
          selectedConfigId={selectedEvent.eventConfigId}
          onChange={handleConfigChange}
        />
        <div>
          <label className="flex items-center gap-2 font-bold mb-3 text-sm uppercase cursor-pointer">
            <input
              type="checkbox"
              checked={selectedEvent.isAllDay || false}
              onChange={(e) => updateEvent({ isAllDay: e.target.checked })}
              className="w-5 h-5 cursor-pointer accent-neo-purple"
            />
            Toute la journée
          </label>
        </div>
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Date de début
          </label>
          <input
            type="datetime-local"
            value={selectedEvent.start.toISOString().slice(0, 16)}
            onChange={(e) => updateEvent({ start: new Date(e.target.value) })}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Date de fin
          </label>
          <input
            type="datetime-local"
            value={selectedEvent.end.toISOString().slice(0, 16)}
            onChange={(e) => updateEvent({ end: new Date(e.target.value) })}
            className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
          />
        </div>
        <div className="mb-4">
          <label className="block font-bold mb-2 text-sm uppercase">
            Récurrence
          </label>
          <select
            value={selectedEvent.recurrence?.type || ""}
            onChange={(e) => {
              const type = e.target.value;
              if (!type) {
                const { recurrence, ...rest } = selectedEvent;
                updateEvent(rest);
              } else {
                updateEvent({
                  recurrence: {
                    type: type as any,
                    endDate: selectedEvent.recurrence?.endDate,
                  },
                });
              }
            }}
            className="w-full p-2 border-[3px] border-black rounded-lg font-space text-sm bg-white"
          >
            <option value="">Aucune (Une fois)</option>
            <option value="daily">Tous les jours</option>
            <option value="weekly">Toutes les semaines</option>
            <option value="biweekly">Toutes les 2 semaines</option>
            <option value="monthly">Tous les mois (date fixe)</option>
            <option value="monthly_day">Tous les mois (même jour de semaine)</option>
            <option value="yearly">Tous les ans</option>
          </select>
        </div>

        <div>
          <ColorPicker
            label="Couleur"
            value={selectedEvent.color}
            onChange={(e) => updateEvent({ color: e.target.value })}
          />
        </div>
        {currentConfig && (
          <DynamicFieldsRenderer
            fieldConfigs={currentConfig.fieldConfigs}
            values={selectedEvent.customFieldsValues}
            onChange={handleCustomFieldChange}
          />
        )}
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={handleClose}
            className="flex-1 bg-neo-cyan border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#00B8D9]"
          >
            Fermer
          </button>
          <button
            onClick={deleteEvent}
            className="flex-1 bg-neo-orange border-[3px] border-black rounded-[10px] p-4 cursor-pointer font-space font-bold text-sm uppercase shadow-neo-md transition-all duration-200 hover:bg-[#e55a2b]"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};
