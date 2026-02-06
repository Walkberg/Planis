import React from "react";
import { Modal } from "../../../components/ui/Modal";

interface DeleteConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  configName: string;
  eventCount: number;
}

export const DeleteConfigModal: React.FC<DeleteConfigModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  configName,
  eventCount,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 max-w-md">
        <div className="bg-neo-orange border-4 border-black p-4 rounded-xl mb-4">
          <h2 className="text-xl font-bold uppercase m-0 text-white">
            ⚠️ Confirmation
          </h2>
        </div>

        <div className="mb-6">
          <p className="font-bold text-base mb-3">
            Voulez-vous vraiment supprimer la configuration "{configName}" ?
          </p>

          {eventCount > 0 ? (
            <div className="bg-neo-yellow/30 border-2 border-black rounded-lg p-3 mb-3">
              <p className="text-sm font-bold">
                ⚠️ {eventCount} événement{eventCount > 1 ? "s" : ""} avec cette
                configuration exist{eventCount > 1 ? "ent" : "e"}.
              </p>
              <p className="text-sm mt-2">
                Si vous confirmez, {eventCount > 1 ? "ils" : "il"} seront
                converti{eventCount > 1 ? "s" : ""} en événement
                {eventCount > 1 ? "s" : ""} basique{eventCount > 1 ? "s" : ""}.
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Cette configuration n'est utilisée par aucun événement.
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white border-[3px] border-black rounded-lg p-3 font-bold text-sm uppercase shadow-neo-md transition-all hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 bg-neo-orange border-[3px] border-black rounded-lg p-3 font-bold text-sm uppercase shadow-neo-md transition-all hover:bg-[#e55a2b]"
          >
            Supprimer
          </button>
        </div>
      </div>
    </Modal>
  );
};
