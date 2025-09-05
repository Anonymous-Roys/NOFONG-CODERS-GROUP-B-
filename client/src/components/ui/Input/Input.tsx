import React from 'react';
import type { BaseComponentProps } from '../../../types';

export interface InputProps extends BaseComponentProps, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      <label 
        htmlFor={inputId} 
        className="block text-lg font-medium mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {icon}
        </div>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-3 text-lg border-2 rounded-full 
          focus:outline-none focus:ring-4 focus:ring-primary-200
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${inputId}-description` : undefined}
        required={required}
        {...props}
       
      />
      {(helperText || error) && (
        <p 
          id={`${inputId}-description`} 
          className={`mt-2 text-lg ${error ? 'text-red-600' : 'text-gray-500'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};