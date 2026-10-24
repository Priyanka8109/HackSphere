import React, { useState, useContext, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import Button from './common/Button';
import TaskItem from './TaskItem';
import { TaskContext, useTasks } from '../context/TaskContext';

/**
 * TaskList Component (Experiment 3)
 * Directly consumes global state from TaskContext using useContext().
 * Provides UI to add tasks (addTask), change status (updateTaskStatus), and delete tasks (deleteTask).
 */
export default function TaskList() {
  // Experiment 3: Access global tasks state and actions directly from TaskContext
  const { tasks, addTask, updateTaskStatus, deleteTask } = useTasks();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('All');

  // Calculate completed count from global tasks
  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.status === 'Done').length;
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    if (filter === 'All') return tasks;
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  // Handle Add Task Submission
  const handleAddTaskSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setErrorMessage('Please enter a task title before adding.');
      return;
    }

    // Call Context action to add task
    addTask(newTaskTitle.trim());
    setNewTaskTitle('');
    setErrorMessage('');
  };

  return (
    <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Sprint Task Checklist</h3>
              <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                {completedCount}/{tasks.length} Done
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click row to cycle: <span className="font-mono font-medium text-slate-700">Todo → In Progress → Done</span> | Click 🗑 to Delete
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            {['All', 'Done', 'In Progress', 'Todo'].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded-md transition-colors ${
                  filter === f
                    ? 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Add Task Form (User Interaction -> Context Action addTask) */}
        <form onSubmit={handleAddTaskSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => {
                setNewTaskTitle(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter a new hackathon task..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Plus}
            >
              Add Task
            </Button>
          </div>
          {errorMessage && (
            <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMessage}
            </p>
          )}
        </form>

        {/* Task Items List */}
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No tasks found for "{filter}" filter.</p>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Tasks Tracked: <strong className="text-blue-600 font-semibold">{tasks.length} total tasks</strong></span>
        <span className="text-[11px] text-slate-400">Live Team Synchronization</span>
      </div>
    </div>
  );
}
