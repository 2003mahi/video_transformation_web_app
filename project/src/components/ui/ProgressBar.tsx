import React from 'react';

interface ProgressBarProps {
  progress: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = '',
  variant = 'primary',
  showLabel = true,
  size = 'md',
  animate = true
}) => {
  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    success: 'bg-green-500'
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${variants[variant]} ${sizes[size]} ${animate ? 'transition-all duration-300' : ''} rounded-full`}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;