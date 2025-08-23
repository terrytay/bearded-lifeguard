import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  description?: string;
}

export function FormField({ label, children, error, required, description }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#20334F]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
      {children}
      {error && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}