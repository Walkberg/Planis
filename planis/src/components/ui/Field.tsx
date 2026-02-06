import React, { createContext, useContext } from "react";

interface FieldContextValue {
  id: string;
  required?: boolean;
  error?: string;
}

const FieldContext = createContext<FieldContextValue | undefined>(undefined);

const useFieldContext = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error("Field components must be used within a Field component");
  }
  return context;
};

interface FieldProps {
  id?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  id,
  required = false,
  error,
  children,
  className = "",
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substring(7)}`;

  return (
    <FieldContext.Provider value={{ id: fieldId, required, error }}>
      <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
    </FieldContext.Provider>
  );
};

interface FieldLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({
  children,
  className = "",
}) => {
  const { id, required } = useFieldContext();

  return (
    <label htmlFor={id} className={`font-bold text-sm uppercase ${className}`}>
      {children}
      {required && <span className="text-neo-orange ml-1">*</span>}
    </label>
  );
};

interface FieldContentProps {
  children: React.ReactNode;
  className?: string;
}

export const FieldContent: React.FC<FieldContentProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

interface FieldActionProps {
  children: React.ReactNode;
  className?: string;
}

export const FieldAction: React.FC<FieldActionProps> = ({
  children,
  className = "",
}) => {
  return <div className={className}>{children}</div>;
};

interface FieldErrorProps {
  children?: React.ReactNode;
  className?: string;
}

export const FieldError: React.FC<FieldErrorProps> = ({
  children,
  className = "",
}) => {
  const { error } = useFieldContext();

  if (!error && !children) return null;

  return (
    <span className={`text-neo-orange text-xs font-bold ${className}`}>
      {children || error}
    </span>
  );
};
