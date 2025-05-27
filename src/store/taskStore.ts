import { create } from 'zustand';
import { Task, TaskChannel } from '../types/tasks';

interface TaskCounts {
  email: number;
  social: number;
  inGym: number;
  misc: number;
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: number) => void;
  updateTaskStatus: (taskId: number, gymName: string, completed: boolean) => void;
  getTasksByDate: (date: string) => TaskCounts;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  
  addTask: (newTask) => set((state) => ({
    tasks: [...state.tasks, { ...newTask, id: Math.max(...state.tasks.map(t => t.id)) + 1 }]
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== taskId)
  })),
  
  updateTaskStatus: (taskId, gymName, completed) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            checklistItems: task.checklistItems.map((item) => ({
              ...item,
              gyms: item.gyms.map((gym) =>
                gym.gymName === gymName
                  ? {
                      ...gym,
                      completed,
                      completedAt: completed ? new Date().toISOString() : undefined,
                    }
                  : gym
              ),
            })),
          };
        }
        return task;
      }),
    })),

  getTasksByDate: (date) => {
    const tasks = get().tasks;
    return {
      email: tasks.filter(t => t.channel === 'email-marketing' && t.dueDate === date).length,
      social: tasks.filter(t => t.channel === 'social-media' && t.dueDate === date).length,
      inGym: tasks.filter(t => t.channel === 'in-gym-marketing' && t.dueDate === date).length,
      misc: tasks.filter(t => t.channel === 'misc' && t.dueDate === date).length
    };
  }
}));