import type { RecurrenceType } from "../../../types";

interface RecurrencePickerProps {
  value?: RecurrenceType;
  onChange: (value?: RecurrenceType) => void;
}

export const RecurrencePicker = ({
  value,
  onChange,
}: RecurrencePickerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    if (!type) {
      onChange(undefined);
    } else {
      onChange(type as RecurrenceType);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-bold mb-2 text-sm uppercase">
        Récurrence
      </label>
      <select
        value={value || ""}
        onChange={handleChange}
        className="w-full p-2 border-[3px] border-black rounded-lg font-space text-sm bg-white"
      >
        <option value="">Aucune (Une fois)</option>
        <option value="daily">Tous les jours</option>
        <option value="weekly">Toutes les semaines</option>
        <option value="biweekly">Toutes les 2 semaines</option>
        <option value="monthly">Tous les mois (date fixe)</option>
        <option value="monthly_day">
          Tous les mois (même jour de semaine)
        </option>
        <option value="yearly">Tous les ans</option>
      </select>
    </div>
  );
};
