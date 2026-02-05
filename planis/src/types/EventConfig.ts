import type { FieldConfig } from "./FieldConfig";

/**
 * Configuration d'un type d'événement
 * Définit les valeurs par défaut et les champs dynamiques pour un type d'événement
 */
export interface EventConfig {
  id: string;
  name: string;
  color: string;
  isAllDay: boolean;
  isSystemConfig: boolean;
  fieldConfigs: FieldConfig[];
}

export const DEFAULT_CONFIGS: EventConfig[] = [
  {
    id: "config-event",
    name: "Événement",
    color: "#00D9FF",
    isAllDay: false,
    isSystemConfig: true,
    fieldConfigs: [],
  },
  {
    id: "config-anniversary",
    name: "Anniversaire",
    color: "#F7931E",
    isAllDay: true,
    isSystemConfig: true,
    fieldConfigs: [],
  },
  {
    id: "config-task",
    name: "Tâche",
    color: "#7B2FBE",
    isAllDay: false,
    isSystemConfig: true,
    fieldConfigs: [
      {
        id: "field-task-state",
        key: "state",
        label: "État",
        type: "select",
        required: true,
        defaultValue: "not_started",
        options: [
          { value: "not_started", label: "Non commencé" },
          { value: "on_going", label: "En cours" },
          { value: "done", label: "Terminé" },
        ],
      },
    ],
  },
];
