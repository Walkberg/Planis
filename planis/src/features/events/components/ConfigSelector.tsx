import React, { useState, useRef, useEffect } from "react";
import { useConfig } from "../../configs/providers/ConfigProvider";

interface ConfigSelectorProps {
  selectedConfigId: string;
  onChange: (configId: string) => void;
}

export const ConfigSelector: React.FC<ConfigSelectorProps> = ({
  selectedConfigId,
  onChange,
}) => {
  const { configs, loading } = useConfig();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedConfig = configs.find((c) => c.id === selectedConfigId);

  const filteredConfigs = configs.filter((config) =>
    config.name.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  if (loading) {
    return <div className="text-sm">Chargement...</div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block font-bold mb-2 text-sm uppercase">
        Type d'événement
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border-[3px] border-black rounded-lg bg-white flex items-center justify-between shadow-neo-sm transition-all hover:bg-gray-50"
      >
        {selectedConfig ? (
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded border-2 border-black"
              style={{ backgroundColor: selectedConfig.color }}
            />
            <span className="font-bold text-sm uppercase">
              {selectedConfig.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm font-bold">
            Sélectionner un type...
          </span>
        )}
        <span className="font-bold transform transition-transform duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border-[3px] border-black rounded-lg shadow-neo-lg overflow-hidden">
          <div className="p-2 border-b-2 border-black bg-gray-50">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un type..."
              className="w-full p-2 border-2 border-black rounded font-space text-sm focus:outline-none focus:shadow-neo-sm"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredConfigs.length > 0 ? (
              filteredConfigs.map((config) => (
                <button
                  key={config.id}
                  type="button"
                  onClick={() => {
                    onChange(config.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 flex items-center gap-3 transition-colors ${
                    selectedConfigId === config.id
                      ? "bg-neo-cyan text-black"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded border-2 border-black"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-bold text-sm uppercase">
                    {config.name}
                  </span>
                  {selectedConfigId === config.id && (
                    <span className="ml-auto font-bold">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-sm text-gray-500 font-bold">
                Aucun résultat
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
