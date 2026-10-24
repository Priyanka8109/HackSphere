import React, { createContext, useContext, useState } from 'react';

/**
 * Experiment 3: Context API for Global State Management
 * TaskContext manages global hackathon tasks accessible across Dashboard, TaskList, and other components.
 */

// 1. Create the Context
export const TaskContext = createContext(null);

// Initial HackSphere Tasks as specified in Experiment 3
const initialTasks = [
  {
    id: 1,
    title: 'Complete UI Design',
    status: 'Done',
    category: 'Frontend',
    assignee: 'Aisha'
  },
  {
    id: 2,
    title: 'Develop Backend API',
    status: 'In Progress',
    category: 'Backend',
    assignee: 'Rahul'
  },
  {
    id: 3,
    title: 'Integrate Database',
    status: 'Todo',
    category: 'Database',
    assignee: 'Priyanka'
  },
  {
    id: 4,
    title: 'Prepare Presentation',
    status: 'Todo',
    category: 'Pitch / Demo',
    assignee: 'Rohan'
  }
];

// 2. Create the Provider Component
export function TaskProvider({ children }) {
  // Global tasks state
  const [tasks, setTasks] = useState(initialTasks);

  /**
   * Action 1: addTask()
   * Adds a new hackathon task to the global state with initial status "Todo"
   */
  const addTask = (title) => {
    if (!title || !title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      status: 'Todo',
      category: 'Sprint Task',
      assignee: 'Priyanka'
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  /**
   * Action 2: updateTaskStatus()
   * Cycles task status: Todo -> In Progress -> Done -> Todo
   */
  const updateTaskStatus = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          let nextStatus = 'Todo';
          if (task.status === 'Todo') nextStatus = 'In Progress';
          else if (task.status === 'In Progress') nextStatus = 'Done';
          else if (task.status === 'Done') nextStatus = 'Todo';

          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  /**
   * Action 3: deleteTask()
   * Removes a task by ID from the global state
   */
  const deleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  // Expose state and actions to consumers
  const value = {
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom Hook: useTasks
 * Convenient helper to consume TaskContext using useContext()
 */
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}

export default TaskContext;
