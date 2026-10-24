import React from 'react';
import { Trophy, Users, Code, Award } from 'lucide-react';
import { howItWorksSteps } from '../../data/mockData';

const iconMap = {
  Trophy: Trophy,
  Users: Users,
  Code: Code,
  Award: Award
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How HackSphere Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Four simple steps to participate, build, and showcase your hackathon project.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, idx) => {
            const Icon = iconMap[step.iconName] || Trophy;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-300">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600">
                  Step {step.step}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
