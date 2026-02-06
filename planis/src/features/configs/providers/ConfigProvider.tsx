import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { EventConfig } from "../../../types/EventConfig";
import { storageProvider } from "../../../storage/IndexedDBStorageProvider";

interface ConfigContextType {
  configs: EventConfig[];
  loading: boolean;
  selectedConfig: EventConfig | null;
  setSelectedConfig: (config: EventConfig | null) => void;
  createConfig: (config: Omit<EventConfig, "id">) => Promise<void>;
  updateConfig: (id: string, updates: Partial<EventConfig>) => Promise<void>;
  deleteConfig: (id: string) => Promise<void>;
  deleteConfigWithConversion: (id: string) => Promise<void>;
  canDeleteConfig: (id: string) => Promise<boolean>;
  getConfigEventCount: (id: string) => Promise<number>;
  refreshConfigs: () => Promise<void>;
  isManagementOpen: boolean;
  openManagement: () => void;
  closeManagement: () => void;
  focusedFieldId: string | null;
  openManagementWithField: (configId: string, fieldId: string) => void;
  filteredConfigId: string | null;
  setFilteredConfigId: (configId: string | null) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within ConfigProvider");
  }
  return context;
};

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [configs, setConfigs] = useState<EventConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<EventConfig | null>(
    null,
  );
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [focusedFieldId, setFocusedFieldId] = useState<string | null>(null);
  const [filteredConfigId, setFilteredConfigId] = useState<string | null>(null);

  const openManagement = () => setIsManagementOpen(true);
  const closeManagement = () => {
    setIsManagementOpen(false);
    setFocusedFieldId(null);
  };

  const openManagementWithField = (configId: string, fieldId: string) => {
    const config = configs.find((c) => c.id === configId);
    if (config) {
      setSelectedConfig(config);
      setFocusedFieldId(fieldId);
      setIsManagementOpen(true);
    }
  };

  const refreshConfigs = async () => {
    try {
      const allConfigs = await storageProvider.getAllConfigs();
      setConfigs(allConfigs);
    } catch (error) {
      console.error("Failed to load configs:", error);
    }
  };

  useEffect(() => {
    const initConfigs = async () => {
      setLoading(true);
      await refreshConfigs();
      setLoading(false);
    };

    initConfigs();
  }, []);

  const createConfig = async (
    config: Omit<EventConfig, "id">,
  ): Promise<void> => {
    const newConfig: EventConfig = {
      ...config,
      id: `config-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };

    await storageProvider.saveConfig(newConfig);
    await refreshConfigs();
  };

  const updateConfig = async (
    id: string,
    updates: Partial<EventConfig>,
  ): Promise<void> => {
    const existing = configs.find((c) => c.id === id);
    if (!existing) {
      throw new Error(`Config with id ${id} not found`);
    }

    const updated = { ...existing, ...updates };
    await storageProvider.saveConfig(updated);
    await refreshConfigs();

    if (selectedConfig?.id === id) {
      setSelectedConfig(updated);
    }
  };

  const canDeleteConfig = async (id: string): Promise<boolean> => {
    const events = await storageProvider.getEventsByConfigId(id);
    return events.length === 0;
  };

  const getConfigEventCount = async (id: string): Promise<number> => {
    const events = await storageProvider.getEventsByConfigId(id);
    return events.length;
  };

  const deleteConfigWithConversion = async (id: string): Promise<void> => {
    const config = configs.find((c) => c.id === id);

    if (config?.isSystemConfig) {
      throw new Error("Cannot delete system configuration");
    }

    const baseConfig = configs.find((c) => c.id === "config-event");
    if (!baseConfig) {
      throw new Error("Base configuration not found");
    }

    const events = await storageProvider.getEventsByConfigId(id);
    for (const event of events) {
      await storageProvider.updateEvent(event.id, {
        eventConfigId: baseConfig.id,
        color: baseConfig.color,
      });
    }

    await storageProvider.deleteConfig(id);
    await refreshConfigs();

    if (selectedConfig?.id === id) {
      setSelectedConfig(null);
    }

    if (filteredConfigId === id) {
      setFilteredConfigId(null);
    }
  };

  const deleteConfig = async (id: string): Promise<void> => {
    const config = configs.find((c) => c.id === id);

    if (config?.isSystemConfig) {
      throw new Error("Cannot delete system configuration");
    }

    const canDelete = await canDeleteConfig(id);
    if (!canDelete) {
      throw new Error(
        "Cannot delete configuration: events are using this configuration",
      );
    }

    await storageProvider.deleteConfig(id);
    await refreshConfigs();

    if (selectedConfig?.id === id) {
      setSelectedConfig(null);
    }
  };

  const value: ConfigContextType = {
    configs,
    loading,
    selectedConfig,
    setSelectedConfig,
    createConfig,
    updateConfig,
    deleteConfig,
    deleteConfigWithConversion,
    canDeleteConfig,
    getConfigEventCount,
    refreshConfigs,
    isManagementOpen,
    openManagement,
    closeManagement,
    focusedFieldId,
    openManagementWithField,
    filteredConfigId,
    setFilteredConfigId,
  };

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
