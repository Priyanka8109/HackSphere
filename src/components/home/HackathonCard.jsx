import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Trophy, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function HackathonCard({ hackathon }) {
  const [showModal, setShowModal] = useState(false);

  const getStatusBadge = (status) => {
    if (status === 'Live') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
          Live
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        Upcoming
      </span>
    );
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
        
        {/* Top Info */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            {getStatusBadge(hackathon.status)}
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              {hackathon.prize} Prize
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2">
            {hackathon.title}
          </h3>
          
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {hackathon.description}
          </p>

          {/* Metadata list */}
          <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Dates:
              </span>
              <span className="font-medium text-slate-800">{hackathon.dates}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Duration:
              </span>
              <span className="font-medium text-slate-800">{hackathon.duration}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Users className="w-3.5 h-3.5 text-emerald-600" /> Participants:
              </span>
              <span className="font-semibold text-slate-800">{hackathon.participants} Hackers</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {hackathon.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-2">
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => setShowModal(true)}
          >
            View Details
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(hackathon.status)}
              <span className="text-xs font-semibold text-slate-500">
                Mode: {hackathon.mode}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-1">{hackathon.title}</h3>
            <p className="text-xs text-blue-600 font-medium mb-3">{hackathon.tagline}</p>
            
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
              {hackathon.description}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Prize</span>
                <span className="text-sm font-bold text-amber-700">{hackathon.prize}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Duration</span>
                <span className="text-sm font-bold text-slate-800">{hackathon.duration}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Registered</span>
                <span className="text-sm font-bold text-emerald-700">{hackathon.participants}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Link to="/login" onClick={() => setShowModal(false)}>
                <Button variant="primary" size="sm" icon={CheckCircle2}>
                  Register Now
                </Button>
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
