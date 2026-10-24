import React from 'react';
import { Bell, AlertCircle, Calendar, Sparkles } from 'lucide-react';

export default function AnnouncementList({ announcements = [] }) {
  const getTypeBadge = (type) => {
    switch (type) {
      case 'Urgent':
        return (
          <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 rounded">
            Urgent
          </span>
        );
      case 'Event':
        return (
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 px-1.5 py-0.5 rounded">
            Session
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.5 rounded">
            Update
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Recent Announcements</h3>
          </div>
          <span className="text-xs text-slate-400">Live Stream</span>
        </div>

        <div className="space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-slate-50 border border-slate-200"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                {getTypeBadge(item.type)}
                <span className="text-[11px] text-slate-400">{item.time}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-snug">
                {item.title}
              </p>
              <div className="mt-1 text-[11px] text-slate-500">
                From: <span className="text-slate-700 font-medium">{item.author}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <span className="text-xs text-blue-600 font-medium">
          All broadcasts are synced
        </span>
      </div>
    </div>
  );
}
