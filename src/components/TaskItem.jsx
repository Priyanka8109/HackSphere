import React from 'react';
import { CheckCircle2, Clock, Circle, Check, Trash2 } from 'lucide-react';

/**
 * TaskItem Component
 * Reusable single task row component that visually displays task status,
 * triggers updateTaskStatus on row click, and allows task deletion.
 */
export default function TaskItem({ task, onStatusChange, onDelete }) {
  const isDone = task.status === 'Done';

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Done':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Done
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            In Progress
          </span>
        );
      case 'Todo':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Circle className="w-3.5 h-3.5 text-slate-400" />
            Todo
          </span>
        );
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent triggering onStatusChange
    if (onDelete) {
      onDelete(task.id);
    }
  };

  return (
    <div
      onClick={() => onStatusChange(task.id)}
      title="Click to cycle status (Todo → In Progress → Done)"
      className={`group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
        isDone
          ? 'bg-slate-50 border-slate-200'
          : task.status === 'In Progress'
          ? 'bg-amber-50/40 border-amber-200 hover:bg-amber-50'
          : 'bg-white border-slate-200 hover:bg-blue-50/40 hover:border-blue-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-4 h-4 rounded flex items-center justify-center border ${
            isDone
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : task.status === 'In Progress'
              ? 'border-amber-400 bg-white'
              : 'border-slate-300 bg-white'
          }`}
        >
          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
        </div>

        <div>
          <h4
            className={`text-xs font-semibold ${
              isDone ? 'text-slate-400 line-through' : 'text-slate-800'
            }`}
          >
            {task.title}
          </h4>
          <div className="text-[11px] text-slate-500 mt-0.5">
            <span>{task.category || 'Sprint Task'}</span> • <span>Assignee: {task.assignee || 'Priyanka'}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {getStatusBadge(task.status)}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            title="Delete task from global state"
            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
