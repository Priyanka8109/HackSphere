import React from 'react';
import { Users, CheckCircle2 } from 'lucide-react';

export default function TeamSection({ team }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{team.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  Active Squad
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track: <span className="text-slate-700 font-medium">{team.track}</span>
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            4 Members
          </span>
        </div>

        {/* Progress */}
        <div className="my-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium">Team Progress</span>
            <span className="font-bold text-blue-700">{team.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${team.progress}%` }}
            />
          </div>
        </div>

        {/* Members Grid */}
        <div className="space-y-2.5 mt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Team Members
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {team.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg ${member.color} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                    {member.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{member.name}</span>
                      {member.name === 'Priyanka' && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1 py-0.2 rounded font-medium">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">{member.role}</div>
                  </div>
                </div>

                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-medium">
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
        <span>Repository: <code className="text-blue-600 font-mono">hacksphere/alpha</code></span>
        <span className="text-slate-400">Synced</span>
      </div>
    </div>
  );
}
