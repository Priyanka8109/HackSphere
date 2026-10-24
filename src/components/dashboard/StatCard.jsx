import React from 'react';
import { Users, CheckSquare, UploadCloud, Clock } from 'lucide-react';

const iconComponents = {
  Users: Users,
  CheckSquare: CheckSquare,
  UploadCloud: UploadCloud,
  Clock: Clock
};

export default function StatCard({ stat }) {
  const Icon = iconComponents[stat.icon] || CheckSquare;

  const colorVariants = {
    blue: {
      border: 'border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      bar: 'bg-blue-600'
    },
    emerald: {
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      bar: 'bg-emerald-600'
    },
    indigo: {
      border: 'border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-700',
      bar: 'bg-indigo-600'
    },
    amber: {
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-700',
      bar: 'bg-amber-600'
    }
  };

  const scheme = colorVariants[stat.color] || colorVariants.blue;

  return (
    <div className={`p-5 rounded-xl bg-white border ${scheme.border} shadow-sm flex flex-col justify-between`}>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {stat.title}
          </span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="text-2xl font-extrabold text-slate-900 mb-1">
          {stat.value}
        </div>

        <p className="text-xs text-slate-500 mb-3">
          {stat.subtitle}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${scheme.bar}`}
          style={{ width: `${stat.percent ?? 0}%` }}
        />
      </div>
    </div>
  );
}
