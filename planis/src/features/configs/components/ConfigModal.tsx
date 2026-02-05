import React from "react";
import { useConfig } from "../providers/ConfigProvider";
import { Modal } from "../../../components/ui/Modal";
import { ConfigEditor } from "./ConfigEditor";

export const ConfigModal: React.FC = () => {
  const { selectedConfig, setSelectedConfig } = useConfig();

  const handleClose = () => {
    setSelectedConfig(null);
  };

  return (
    <Modal isOpen={selectedConfig !== null} onClose={handleClose}>
      <ConfigEditor />
    </Modal>
  );
};
