import { create } from 'zustand';
import { Task, TaskChannel, TaskCounts } from '../types/tasks';
import { format } from 'date-fns';

export interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: number) => void;
  updateTaskStatus: (taskId: number, gymName: string, completed: boolean) => void;
  getTasksByDate: (date: string) => TaskCounts;
  getTasksForDateRange: (startDate: Date, endDate: Date) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  
  addTask: (newTask) => set((state) => ({
    tasks: [...state.tasks, { 
      ...newTask, 
      task_id: crypto.randomUUID(),
      status: 'pending',
      createdAt: new Date().toISOString()
    }]
  })),
  
  deleteTask: (task_id) => set((state) => ({
    tasks: state.tasks.filter(task => task.task_id !== task_id)
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
    const formattedDate = format(new Date(date), 'yyyy-MM-dd');
    
    return {
      email: tasks.filter(t => t.channel === 'Email' && format(new Date(t.due_date), 'yyyy-MM-dd') === formattedDate).length,
      social: tasks.filter(t => t.channel === 'Social' && format(new Date(t.due_date), 'yyyy-MM-dd') === formattedDate).length,
      inGym: tasks.filter(t => t.channel === 'In-Gym' && format(new Date(t.due_date), 'yyyy-MM-dd') === formattedDate).length
    };
  },
  
  getTasksForDateRange: (startDate, endDate) => {
    const tasks = get().tasks;
    return tasks.filter(task => {
      const taskDate = new Date(task.due_date);
      return taskDate >= startDate && taskDate <= endDate;
    });
  }
}));