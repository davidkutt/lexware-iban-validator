import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  noPadding?: boolean;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'primary' | 'success' | 'dark' | 'danger';
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

const gradients = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700',
  success: 'bg-gradient-to-r from-success-600 to-success-700',
  dark: 'bg-gradient-to-r from-gray-800 to-gray-900',
  danger: 'bg-gradient-to-r from-red-600 to-red-700',
};

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, noPadding = false }) => {
  const hoverStyles = hoverable ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : '';
  const paddingStyles = noPadding ? '' : 'overflow-hidden';

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${paddingStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', gradient }) => {
  const gradientStyle = gradient ? `${gradients[gradient]} text-white` : 'bg-white border-b border-gray-200';

  return (
    <div className={`px-6 py-4 rounded-t-xl ${gradientStyle} ${className}`}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};
