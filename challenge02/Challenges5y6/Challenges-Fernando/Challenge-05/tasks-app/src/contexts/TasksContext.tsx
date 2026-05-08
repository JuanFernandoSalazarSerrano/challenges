import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Task } from '../types/task';

interface TaskInput {
  title: string;
  description: string;
}

interface TasksContextValue {
  tasks: Task[];
  addTask: (input: TaskInput) => void;
  updateTask: (taskId: string, input: TaskInput) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompleted: (taskId: string) => void;
  getTaskById: (taskId: string) => Task | undefined;
}

const TasksContext = createContext<TasksContextValue | null>(null);

const storageKeyByUser = (uid: string) => `challenge05:tasks:${uid}`;

export const TasksProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      return;
    }

    const key = storageKeyByUser(currentUser.uid);
    const stored = localStorage.getItem(key);

    if (!stored) {
      setTasks([]);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Task[];
      setTasks(Array.isArray(parsed) ? parsed : []);
    } catch {
      setTasks([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    localStorage.setItem(storageKeyByUser(currentUser.uid), JSON.stringify(tasks));
  }, [tasks, currentUser]);

  const addTask = useCallback((input: TaskInput) => {
    const now = new Date().toISOString();

    const newTask: Task = {
      id: `${Date.now()}`,
      title: input.title.trim(),
      description: input.description.trim(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((taskId: string, input: TaskInput) => {
    const now = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: input.title.trim(),
              description: input.description.trim(),
              updatedAt: now,
            }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const toggleTaskCompleted = useCallback((taskId: string) => {
    const now = new Date().toISOString();

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: now,
            }
          : task,
      ),
    );
  }, []);

  const getTaskById = useCallback(
    (taskId: string) => tasks.find((task) => task.id === taskId),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompleted,
      getTaskById,
    }),
    [tasks, addTask, updateTask, deleteTask, toggleTaskCompleted, getTaskById],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasksContext = () => {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider.');
  }

  return context;
};
