import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({ icon, label, isActive = false, className = '', ...rest }) => {
  const activeClasses = isActive ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100';
  return (
    <button
      className={`flex items-center justify-center p-2 md:p-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ease-in-out ${activeClasses} ${className}`}
      {...rest}
    >
      {icon && <span className="mr-0 md:mr-2 text-xl md:text-2xl">{icon}</span>}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
};

export default Button;