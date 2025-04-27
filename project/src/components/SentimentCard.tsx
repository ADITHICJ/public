import React from 'react';

interface SentimentCardProps {
  title: string;
  value: number;
  percentage?: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  trend?: {
    value: number;
    label: string;
  };
}

const SentimentCard = ({ title, value, percentage, icon, bgColor, textColor, trend }: SentimentCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 transition-transform hover:translate-y-[-2px]">
      <div className="flex justify-between">
        <div>
          <p className="text-neutral-500 text-sm font-medium">{title}</p>
          <div className="flex items-end mt-1">
            <h3 className="text-2xl font-display font-semibold text-neutral-900">{value}</h3>
            {percentage !== undefined && (
              <p className="ml-2 text-sm font-medium text-success-600 mb-1">
                {percentage}%
              </p>
            )}
          </div>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value > 0 ? 'text-success-600' : 'text-error-600'}`}>
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg self-start`}>
          {icon}
        </div>
      </div>
      
      {percentage !== undefined && (
        <div className="mt-3 pt-3 border-t">
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mb-1">
            <div 
              className={`${
                percentage > 66 ? 'bg-success-500' : 
                percentage > 33 ? 'bg-warning-500' : 
                'bg-error-500'
              } h-1.5 rounded-full`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentCard;