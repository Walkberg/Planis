import React, { useState, useEffect } from "react";
import { useConfig } from "../providers/ConfigProvider";
import { FieldConfigEditor } from "./FieldConfigEditor";
import type { EventConfig } from "../../../types/EventConfig";
import type { FieldConfig } from "../../../types/FieldConfig";

import { ColorPicker } from "../../../components/ui/ColorPicker";
import { RecurrencePicker } from "../../events/components/RecurencyPicker";

export const ConfigEditor: React.FC = () => {
  const {
    selectedConfig,
    setSelectedConfig,
    updateConfig,
    createConfig,
    deleteConfig,
    canDeleteConfig,
  } = useConfig();

  const [formData, setFormData] = useState<EventConfig | null>(null);
  const [error, setError] = useState<string>("");
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    if (selectedConfig) {
      setFormData({ ...selectedConfig });
      if (selectedConfig.id) {
        canDeleteConfig(selectedConfig.id).then(setCanDelete);
      }
    } else {
      setFormData(null);
    }
  }, [selectedConfig]);

  if (!formData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <p className="text-lg font-bold">Aucune configuration sélectionnée</p>
          <p className="text-sm mt-2">
            Sélectionnez une configuration ou créez-en une nouvelle
          </p>
        </div>
      </div>
    );
  }

  const isNewConfig = !formData.id;
  const isSystemConfig = formData.isSystemConfig;

  const handleSave = async () => {
    setError("");

    if (!formData.name.trim()) {
      setError("Le nom est obligatoire");
      return;
    }

    try {
      if (isNewConfig) {
        await createConfig(formData);
      } else {
        await updateConfig(formData.id, formData);
      }
      setSelectedConfig(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    if (
      !window.confirm(
        "Êtes-vous sûr de vouloir supprimer cette configuration ?",
      )
    ) {
      return;
    }

    try {
      await deleteConfig(formData.id);
      setSelectedConfig(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression");
    }
  };

  const handleAddField = () => {
    const newField: FieldConfig = {
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      key: "",
      label: "",
      type: "text",
      required: false,
    };

    setFormData({
      ...formData,
      fieldConfigs: [...formData.fieldConfigs, newField],
    });
  };

  const handleUpdateField = (index: number, updated: FieldConfig) => {
    const newFields = [...formData.fieldConfigs];
    newFields[index] = updated;
    setFormData({ ...formData, fieldConfigs: newFields });
  };

  const handleRemoveField = (index: number) => {
    const newFields = [...formData.fieldConfigs];
    newFields.splice(index, 1);
    setFormData({ ...formData, fieldConfigs: newFields });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-neo-purple border-4 border-black p-4 shadow-neo-lg rounded-xl text-white mb-4">
        <h2 className="text-xl font-bold uppercase m-0">
          {isNewConfig ? "Nouvelle Configuration" : `Éditer: ${formData.name}`}
        </h2>
        {isSystemConfig && (
          <p className="text-sm mt-1 opacity-90">
            Configuration système - Modification limitée
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {error && (
          <div className="bg-neo-orange border-[3px] border-black p-3 rounded-lg mb-4 font-bold">
            ⚠️ {error}
          </div>
        )}
        <div className="mb-4">
          <label className="block font-bold mb-2 text-sm uppercase">
            Nom de la configuration
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSystemConfig}
            className={`w-full p-3 border-[3px] border-black rounded-lg font-space text-sm ${
              isSystemConfig ? "bg-gray-100" : ""
            }`}
            placeholder="Ex: Rendez-vous médical"
          />
        </div>
        <div className="mb-4">
          <ColorPicker
            label="Couleur par défaut"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
          />
        </div>
        <div className="mb-6">
          <label className="flex items-center gap-2 font-bold text-sm uppercase cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAllDay}
              onChange={(e) =>
                setFormData({ ...formData, isAllDay: e.target.checked })
              }
              className="w-5 h-5 cursor-pointer accent-neo-purple"
            />
            Toute la journée par défaut
          </label>
        </div>

        <div className="mb-6 p-4 bg-neo-yellow/20 border-[3px] border-black rounded-lg">
          <h3 className="font-bold uppercase text-sm mb-3">
            Récurrence par défaut
          </h3>
          <div className="mb-3">
            <label className="flex items-center gap-2 font-bold text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={formData.defaultRecurrence?.enabled ?? false}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData({
                      ...formData,
                      defaultRecurrence: {
                        type: formData.defaultRecurrence?.type ?? "yearly",
                        enabled: true,
                      },
                    });
                  } else {
                    setFormData({
                      ...formData,
                      defaultRecurrence: undefined,
                    });
                  }
                }}
                className="w-5 h-5 cursor-pointer accent-neo-purple"
              />
              Activer la récurrence automatique
            </label>
          </div>

          {formData.defaultRecurrence?.enabled && (
            <RecurrencePicker
              value={formData.defaultRecurrence.type}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  defaultRecurrence: {
                    ...formData.defaultRecurrence!,
                    type: value!,
                  },
                })
              }
            />
          )}
        </div>
        <div className="border-t-4 border-black pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold uppercase text-sm">Champs dynamiques</h3>
            <button
              onClick={handleAddField}
              disabled={isSystemConfig}
              className={`bg-neo-green border-[3px] border-black rounded-lg px-3 py-2 font-bold text-sm uppercase shadow-neo-md transition-all ${
                isSystemConfig
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#2ecc71]"
              }`}
            >
              + Ajouter un champ
            </button>
          </div>

          {formData.fieldConfigs.length > 0 ? (
            <div>
              {formData.fieldConfigs.map((field, index) => (
                <FieldConfigEditor
                  key={field.id}
                  field={field}
                  onChange={(updated) => handleUpdateField(index, updated)}
                  onRemove={() => handleRemoveField(index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic p-4 bg-gray-50 border-2 border-black rounded-lg">
              Aucun champ dynamique défini
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mt-4 pt-4 border-t-4 border-black">
        <button
          onClick={() => setSelectedConfig(null)}
          className="flex-1 bg-gray-200 border-[3px] border-black rounded-lg p-3 cursor-pointer font-bold text-sm uppercase shadow-neo-md transition-all hover:bg-gray-300"
        >
          Annuler
        </button>
        {!isNewConfig && !isSystemConfig && (
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className={`flex-1 border-[3px] border-black rounded-lg p-3 font-bold text-sm uppercase shadow-neo-md transition-all ${
              canDelete
                ? "bg-neo-orange hover:bg-[#e55a2b] cursor-pointer"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
            title={
              !canDelete
                ? "Impossible de supprimer: des événements utilisent cette configuration"
                : ""
            }
          >
            Supprimer
          </button>
        )}
        <button
          onClick={handleSave}
          className="flex-1 bg-neo-cyan border-[3px] border-black rounded-lg p-3 cursor-pointer font-bold text-sm uppercase shadow-neo-md transition-all hover:bg-[#00B8D9]"
        >
          {isNewConfig ? "Créer" : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
};
