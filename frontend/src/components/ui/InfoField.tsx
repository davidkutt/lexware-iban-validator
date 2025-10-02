import React from 'react';

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  className?: string;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label,
  value,
  mono = false,
  className = ''
}) => {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div
        className={`text-base bg-white p-3 rounded-lg border-2 border-gray-200 ${
          mono ? 'font-mono' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
};

export default InfoField;
