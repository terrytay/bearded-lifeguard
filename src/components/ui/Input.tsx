import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, icon, ...props }, ref) => {
    const baseStyles = `w-full rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 
      focus:outline-none focus:ring-4 focus:ring-[#FF6633]/10 disabled:opacity-50 disabled:cursor-not-allowed
      placeholder:text-gray-400`;
    
    const stateStyles = error
      ? 'border-red-300 focus:border-red-500'
      : 'border-gray-200 focus:border-[#FF6633] hover:border-gray-300';

    return (
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${stateStyles} ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';