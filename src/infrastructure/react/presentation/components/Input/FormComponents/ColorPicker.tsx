import React from 'react';

interface ColorPickerProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ColorPicker({ name, label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-x-2">
      <label htmlFor={name}>{label}:</label>
      <input
        type="color"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
      />
      <span className="font-mono text-sm">{value}</span>
    </div>
  );
}
