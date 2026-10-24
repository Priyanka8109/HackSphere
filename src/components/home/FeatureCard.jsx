import React from 'react';
import { Users, Radio, FileCode2, Sparkles, CheckCircle2, BarChart3 } from 'lucide-react';
import { platformFeatures } from '../../data/mockData';

const iconMap = {
  Users: Users,
  Radio: Radio,
  FileCode2: FileCode2,
  Sparkles: Sparkles,
  CheckCircle2: CheckCircle2,
  BarChart3: BarChart3
};

export default function FeatureCard() {
  return (
    <section id="features" className="py-14 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Platform Features
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Essential tools designed to help teams collaborate, build, and submit projects.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feature, idx) => {
            const Icon = iconMap[feature.iconName] || Sparkles;
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
