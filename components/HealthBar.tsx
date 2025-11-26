import React from 'react';

interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
}

const HealthBar: React.FC<HealthBarProps> = ({ current, max, label }) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  let colorClass = "bg-green-500";
  if (percentage < 50) colorClass = "bg-yellow-400";
  if (percentage < 20) colorClass = "bg-red-500";

  return (
    <div className="w-full max-w-xs bg-slate-800 rounded-lg p-3 border border-slate-700 shadow-md">
      {label && (
        <div className="flex justify-between mb-1 text-sm font-bold text-white tracking-wide">
          <span>{label}</span>
          <span>{Math.max(0, current)} / {max}</span>
        </div>
      )}
      <div className="w-full bg-slate-700 rounded-full h-4 border border-slate-600 overflow-hidden relative">
         {/* Background pattern for retro feel */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default HealthBar;
