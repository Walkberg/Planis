import React, { useState } from "react";
import { ConfigList } from "./ConfigList";
import { ConfigEditor } from "./ConfigEditor";

export const ConfigManagement: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-neo-purple text-white border-4 border-black rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl shadow-neo-lg hover:scale-110 transition-transform z-50"
        title="Gérer les configurations"
      >
        ⚙️
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
      <div className="bg-neo-yellow border-4 border-black rounded-xl shadow-neo-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b-4 border-black">
          <h1 className="text-3xl font-bold uppercase">
            Gestion des Configurations
          </h1>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-neo-orange border-[3px] border-black rounded-lg px-4 py-2 font-bold uppercase shadow-neo-md hover:bg-[#e55a2b] transition-all"
          >
            ✕ Fermer
          </button>
        </div>
        <div className="flex-1 overflow-hidden grid grid-cols-[350px,1fr] gap-6 p-6">
          <div className="overflow-hidden">
            <ConfigList />
          </div>
          <div className="overflow-hidden border-l-4 border-black pl-6">
            <ConfigEditor />
          </div>
        </div>
      </div>
    </div>
  );
};
