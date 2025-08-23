import React from 'react';
import { Plus, Minus, Users } from 'lucide-react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  icon?: React.ReactNode;
  error?: boolean;
  className?: string;
}

export const NumberInput = React.forwardRef<HTMLDivElement, NumberInputProps>(
  ({ value, onChange, min = 1, max = 10, label, icon, error, className = '' }, ref) => {
    const handleIncrement = () => {
      if (value < max) {
        onChange(value + 1);
      }
    };

    const handleDecrement = () => {
      if (value > min) {
        onChange(value - 1);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value) || min;
      if (newValue >= min && newValue <= max) {
        onChange(newValue);
      }
    };

    const baseStyles = `flex items-center rounded-xl border-2 bg-white transition-all duration-200 
      focus-within:ring-4 focus-within:ring-[#FF6633]/10`;
    
    const stateStyles = error
      ? 'border-red-300 focus-within:border-red-500'
      : 'border-gray-200 focus-within:border-[#FF6633] hover:border-gray-300';

    return (
      <div ref={ref} className={`${baseStyles} ${stateStyles} ${className}`}>
        {icon && (
          <div className="pl-4 text-gray-400">
            {icon}
          </div>
        )}
        
        <div className="flex items-center justify-between flex-1">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={value <= min}
            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl transition-colors"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="flex flex-col items-center px-4">
            <input
              type="number"
              value={value}
              onChange={handleInputChange}
              min={min}
              max={max}
              className="w-16 text-center text-2xl font-bold text-[#FF6633] border-none outline-none bg-transparent"
            />
            {label && (
              <span className="text-xs text-gray-500 mt-1">{label}</span>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleIncrement}
            disabled={value >= max}
            className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-xl transition-colors"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';