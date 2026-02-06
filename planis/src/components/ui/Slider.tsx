export const Slider: React.FC<{
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}> = ({ min, max, value, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={handleChange}
      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer border-2 border-black"
      style={{
        background: `linear-gradient(to right, #00D9FF 0%, #00D9FF ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
      }}
    />
  );
};
