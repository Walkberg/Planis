import React from "react";
import type { FieldConfig, SelectOption } from "../../../types/FieldConfig";

interface FieldConfigEditorProps {
  field: FieldConfig;
  onChange: (field: FieldConfig) => void;
  onRemove: () => void;
}

export const FieldConfigEditor: React.FC<FieldConfigEditorProps> = ({
  field,
  onChange,
  onRemove,
}) => {
  const handleOptionAdd = () => {
    const newOption: SelectOption = {
      value: `option_${Date.now()}`,
      label: "Nouvelle option",
    };
    const updatedField = {
      ...field,
      options: [...(field.options || []), newOption],
    } as any;
    onChange(updatedField);
  };

  const handleOptionUpdate = (index: number, updated: SelectOption) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = updated;
    const updatedField = { ...field, options: newOptions } as any;
    onChange(updatedField);
  };

  const handleOptionRemove = (index: number) => {
    const newOptions = [...(field.options || [])];
    newOptions.splice(index, 1);
    const updatedField = { ...field, options: newOptions } as any;
    onChange(updatedField);
  };

  return (
    <div className="border-[3px] border-black rounded-lg p-4 bg-white mb-3">
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
            <option value="color">Couleur</option>
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
      </div>
      {field.type === "select" && (
        <div className="mt-3 border-t-2 border-black pt-3">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-xs uppercase">Options</label>
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
