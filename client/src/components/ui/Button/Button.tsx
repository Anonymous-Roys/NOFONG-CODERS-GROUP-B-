import React from 'react';
import type { BaseComponentProps } from '../../../types';

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-full focus:outline-none focus:ring-4 focus:ring-opacity-50 transition-colors';
  
  const variantClasses = {
    primary: 'bg-brand text-white hover:bg-primary-900 focus:ring-primary-400',
    secondary: 'bg-primary-300 text-brand hover:bg-primary-400 focus:ring-primary-400',
    outline: 'border-2 border-brand text-brand hover:bg-primary-300 focus:ring-primary-400',
    ghost: 'text-brand hover:bg-primary-300 focus:ring-primary-400',
  };
  
  // sizes are normalized to senior-friendly tokens below
  
  const seniorSizeClasses = {
    sm: 'px-5 py-3 text-base min-h-[48px]',
    md: 'px-6 py-3.5 text-lg min-h-[52px]',
    lg: 'px-7 py-4 text-xl min-h-[56px]',
  };
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    seniorSizeClasses[size], // Using senior-friendly sizes
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};