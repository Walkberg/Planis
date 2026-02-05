import { useEffect, useRef, useState } from "react";
import { useEvents } from "../providers/EventsProvider";
import { useConfig } from "../../configs/providers/ConfigProvider";
import { ConfigSelector } from "./ConfigSelector";
import { DynamicFieldsRenderer } from "./DynamicFieldsRenderer";
import { ColorPicker } from "../../../components/ui/ColorPicker";
import { RecurrencePicker } from "./RecurencyPicker";
import { ColorField } from "../../../components/ui/ColorField";

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

      if (e.key === "Delete") {
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")
        ) {
          deleteEvent();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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

    const updates: any = {
      eventConfigId: configId,
      color: newConfig.color,
      isAllDay: newConfig.isAllDay,
      customFieldsValues: defaultCustomFields,
    };

    if (newConfig.defaultRecurrence?.enabled) {
      updates.recurrence = {
        type: newConfig.defaultRecurrence.type,
        endDate: undefined,
      };
    } else if (!newConfig.defaultRecurrence) {
      updates.recurrence = undefined;
    }

    updateEvent(updates);
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
      <ConfigSelector
        selectedConfigId={selectedEvent.eventConfigId}
        onChange={handleConfigChange}
      />
      <div className="flex flex-col gap-4">
        <div>
          <label className="block font-bold mb-2 text-sm uppercase">
            Titre
          </label>
          <div className="flex flex-row gap-2">
            <ColorPicker
              value={selectedEvent.color}
              onChange={(e) => updateEvent({ color: e.target.value })}
            />
            <input
              ref={titleInputRef}
              type="text"
              value={selectedEvent.title}
              onChange={(e) => updateEvent({ title: e.target.value })}
              placeholder="Entrez le titre de l'événement..."
              className="w-full p-3 border-[3px] border-black rounded-lg font-space text-sm box-border"
            />
          </div>
        </div>
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
        <RecurrencePicker
          value={selectedEvent.recurrence?.type}
          onChange={(value) => {
            if (!value) {
              const { recurrence, ...rest } = selectedEvent;
              updateEvent(rest);
            } else {
              updateEvent({
                recurrence: {
                  type: value,
                  endDate: selectedEvent.recurrence?.endDate,
                },
              });
            }
          }}
        />

        {currentConfig && (
          <DynamicFieldsRenderer
            fieldConfigs={currentConfig.fieldConfigs}
            values={selectedEvent.customFieldsValues}
            onChange={handleCustomFieldChange}
            eventId={selectedEvent.id}
            configId={selectedEvent.eventConfigId}
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
