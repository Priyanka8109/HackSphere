import React from 'react';
import { Clock, UploadCloud, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export default function DeadlineCard({ currentHackathon, onOpenSubmitModal }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
            <Clock className="w-3.5 h-3.5" />
            <span>Submission Deadline</span>
          </div>
          <span className="text-xs font-bold text-slate-700">
            2 Days Left
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">
          Final Project Package Submission
        </h3>
        
        <p className="text-xs text-slate-600 mb-4">
          Deadline: <span className="font-semibold text-slate-900">{currentHackathon.deadline}</span>
        </p>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Readiness</span>
            <span className="font-bold text-blue-600">{currentHackathon.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${currentHackathon.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          size="md"
          className="w-full justify-center"
          icon={UploadCloud}
          onClick={onOpenSubmitModal}
        >
          Open Submission Form
        </Button>
      </div>
    </div>
  );
}
