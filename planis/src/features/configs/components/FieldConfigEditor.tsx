import React, { useEffect, useRef } from "react";
import type { FieldConfig, SelectOption } from "../../../types/FieldConfig";
import { EyeIcon } from "../../../components/ui/EyeIcon";
import { displayConfig } from "../../events/config/EventDisplayConfig";
interface FieldConfigEditorProps {
  field: FieldConfig;
  onChange: (field: FieldConfig) => void;
  onRemove: () => void;
  isFocused?: boolean;
}

export const FieldConfigEditor: React.FC<FieldConfigEditorProps> = ({
  field,
  onChange,
  onRemove,
  isFocused = false,
}) => {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && fieldRef.current) {
      fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isFocused]);

  const handleOptionAdd = () => {
    const newOption: SelectOption = {
      value: `option_${Date.now()}`,
      label: "Nouvelle option",
    };
    const updatedField = {
      ...field,
      options: [...((field as any).options || []), newOption],
    } as any;
    onChange(updatedField);
  };

  const handleOptionUpdate = (index: number, updated: SelectOption) => {
    const newOptions = [...((field as any).options || [])];
    newOptions[index] = updated;
    const updatedField = { ...field, options: newOptions } as any;
    onChange(updatedField);
  };

  const handleOptionRemove = (index: number) => {
    const newOptions = [...((field as any).options || [])];
    newOptions.splice(index, 1);
    const updatedField = { ...field, options: newOptions } as any;
    onChange(updatedField);
  };

  return (
    <div
      ref={fieldRef}
      className={`border-[3px] border-black rounded-lg p-4 bg-white mb-3 transition-all ${
        isFocused ? "ring-4 ring-neo-orange shadow-neo-lg" : ""
      }`}
    >
      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block font-bold text-xs uppercase mb-2">
            Label
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onChange({ ...field, label: e.target.value })}
            className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
            placeholder="Ex: Note, État..."
          />
        </div>
        <div className="flex-1">
          <label className="block font-bold text-xs uppercase mb-2">Clé</label>
          <input
            type="text"
            value={field.key}
            onChange={(e) => onChange({ ...field, key: e.target.value })}
            className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
            placeholder="Ex: note, state..."
          />
        </div>
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="block font-bold text-xs uppercase mb-2">Type</label>
          <select
            value={field.type}
            onChange={(e) =>
              onChange({
                ...field,
                type: e.target.value,
              } as any as FieldConfig)
            }
            className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
          >
            <option value="text">Texte</option>
            <option value="textarea">Texte long</option>
            <option value="number">Nombre</option>
            <option value="date">Date</option>
            <option value="boolean">Oui/Non</option>
            <option value="select">Liste déroulante</option>
            <option value="checklist">Todo List</option>
            <option value="color">Couleur</option>
            <option value="counter">Compteur</option>
            <option value="indicator">Indicateur</option>
            <option value="mood">Humeur</option>
            <option value="status">État</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-bold text-xs uppercase mb-2">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) =>
              onChange({ ...field, placeholder: e.target.value })
            }
            className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
            placeholder="Texte d'aide..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={field.required || false}
            onChange={(e) => onChange({ ...field, required: e.target.checked })}
            className="w-4 h-4 cursor-pointer accent-neo-purple"
          />
          <span className="text-sm font-bold">Requis</span>
        </label>

        {displayConfig[field.type]?.displayOnEvent && (
          <label
            className="flex items-center gap-2 cursor-pointer"
            title="Afficher ce champ directement sur la tuile d'événement"
          >
            <input
              type="checkbox"
              checked={field.displayOnEvent || false}
              onChange={(e) =>
                onChange({ ...field, displayOnEvent: e.target.checked })
              }
              className="w-4 h-4 cursor-pointer accent-neo-cyan"
            />
            <span className="text-sm font-bold flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>Afficher sur l'événement</span>
            </span>
          </label>
        )}
      </div>

      {field.type === "counter" && (
        <div className="mb-3 p-3 bg-neo-cyan/20 border-[3px] border-black rounded-lg">
          <label className="block font-bold text-xs uppercase mb-2">
            Portée du compteur
          </label>
          <select
            value={(field as any).scope || "event"}
            onChange={(e) =>
              onChange({
                ...field,
                scope: e.target.value as "config" | "event",
              } as any)
            }
            className="w-full p-2 border-[3px] border-black rounded-lg text-sm bg-white"
          >
            <option value="event">
              Par événement (chaque événement a son propre compteur)
            </option>
            <option value="config">
              Par configuration (tous les événements partagent le même compteur)
            </option>
          </select>
          <p className="text-xs text-gray-600 mt-2">
            {(field as any).scope === "config"
              ? "🔗 Tous les événements de cette configuration partageront le même compteur."
              : "🔒 Chaque événement aura son propre compteur indépendant."}
          </p>
        </div>
      )}

      {field.type === "indicator" && (
        <div className="mb-3 p-3 bg-neo-purple/20 border-[3px] border-black rounded-lg">
          <label className="block font-bold text-xs uppercase mb-2">
            Plage de valeurs
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Minimum</label>
              <input
                type="number"
                value={(field as any).min ?? -10}
                onChange={(e) =>
                  onChange({
                    ...field,
                    min: parseInt(e.target.value, 10) || -10,
                  } as any)
                }
                className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1">Maximum</label>
              <input
                type="number"
                value={(field as any).max ?? 10}
                onChange={(e) =>
                  onChange({
                    ...field,
                    max: parseInt(e.target.value, 10) || 10,
                  } as any)
                }
                className="w-full p-2 border-[3px] border-black rounded-lg text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            📊 L'indicateur permettra de définir une valeur entre{" "}
            {(field as any).min ?? -10} et {(field as any).max ?? 10} pour
            chaque événement.
          </p>
        </div>
      )}

      {(field.type === "select" || field.type === "checklist") && (
        <div className="mt-3 border-t-2 border-black pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-xs uppercase">
              {field.type === "checklist" ? "Tâches" : "Options"}
            </label>
            <button
              onClick={handleOptionAdd}
              className="text-xs bg-neo-green border-2 border-black rounded px-2 py-1 font-bold hover:bg-[#2ecc71]"
            >
              + Ajouter option
            </button>
          </div>
          {field.options && field.options.length > 0 ? (
            <div className="space-y-2">
              {field.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) =>
                      handleOptionUpdate(index, {
                        ...option,
                        value: e.target.value,
                      })
                    }
                    className="flex-1 p-2 border-2 border-black rounded text-sm"
                    placeholder="Valeur"
                  />
                  <input
                    type="text"
                    value={option.label}
                    onChange={(e) =>
                      handleOptionUpdate(index, {
                        ...option,
                        label: e.target.value,
                      })
                    }
                    className="flex-1 p-2 border-2 border-black rounded text-sm"
                    placeholder="Label"
                  />
                  <button
                    onClick={() => handleOptionRemove(index)}
                    className="px-3 bg-neo-orange border-2 border-black rounded font-bold hover:bg-[#e55a2b]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Aucune option définie
            </div>
          )}
        </div>
      )}

      <button
        onClick={onRemove}
        className="mt-3 w-full bg-neo-orange border-[3px] border-black rounded-lg p-2 font-bold text-sm uppercase shadow-neo-sm hover:bg-[#e55a2b]"
      >
        Supprimer ce champ
      </button>
    </div>
  );
};
