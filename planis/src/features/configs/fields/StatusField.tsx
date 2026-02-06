import React from "react";
import { Status } from "../../../components/ui/Status";
import type { StatusFieldConfig } from "../../../types/FieldConfig";

interface StatusFieldProps {
  config: StatusFieldConfig;
  value: number;
  onChange: (value: number) => void;
}

export const StatusField: React.FC<StatusFieldProps> = ({
  value,
  onChange,
}) => {
  return <Status value={value || 3} onChange={onChange} />;
};
