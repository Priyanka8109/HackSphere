import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-400 shadow-sm",
    outline: "bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600 focus:ring-blue-500",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-300",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 shadow-sm"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
