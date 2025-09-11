import React from 'react';
import type { BaseComponentProps } from '../../../types';

export interface InputProps extends BaseComponentProps, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  endIcon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full relative">
      <label 
        htmlFor={inputId} 
        className="block text-lg font-medium mb-2 font-heading text-[var(--color-text-strong)]"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={inputId}
        className={`
          w-full ${icon ? 'pl-10' : 'px-5'} ${endIcon ? 'pr-12' : 'pr-5'} py-3 text-lg border-2 rounded-full 
          bg-white text-[var(--color-text-strong)]
          focus:outline-none focus:ring-4 focus:ring-primary-400
          transition-colors placeholder:text-[var(--color-placeholder)]
          ${error ? 'border-red-500' : 'border-[var(--color-border-gray)]'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${inputId}-description` : undefined}
        required={required}
        {...props}
       
      />
      {endIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {endIcon}
        </div>
      )}
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