import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'neutral';
  colorScheme?: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
}

export const StatCard: React.FC<StatCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'success',
  colorScheme = 'emerald',
}) => {
  const iconColors = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const badgeColors = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    info: 'bg-blue-50 text-blue-700',
    neutral: 'bg-slate-100 text-slate-700',
  };

  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-all"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className={`p-2.5 rounded-lg border ${iconColors[colorScheme]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        {(subtitle || badgeText) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {badgeText && (
              <span className={`px-2 py-0.5 rounded-full font-medium ${badgeColors[badgeType]}`}>
                {badgeText}
              </span>
            )}
            {subtitle && <span className="text-slate-600 font-normal">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};
