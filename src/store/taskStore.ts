import { create } from 'zustand';
import { Task } from '../types/tasks';
import { tasks as initialTasks } from '../data/tasks';

interface TaskStore {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  deleteTask: (taskId: number) => void;
  updateTaskStatus: (taskId: number, gymName: string, completed: boolean) => void;
  toggleChecklistItem: (taskId: number, itemIndex: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: initialTasks,
  
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

  toggleChecklistItem: (taskId, itemIndex) =>
    set((state) => ({
      tasks: state.tasks.map((task) => {
        if (task.id === taskId) {
          const [description, checklist] = task.description.split('\n\nChecklist:\n');
          if (!checklist) return task;

          const items = checklist.split('\n');
          const item = items[itemIndex];
          if (!item) return task;

          const isChecked = item.includes('- [x] ');
          items[itemIndex] = item.replace(
            isChecked ? '- [x] ' : '- [ ] ',
            isChecked ? '- [ ] ' : '- [x] '
          );

          return {
            ...task,
            description: `${description}\n\nChecklist:\n${items.join('\n')}`
          };
        }
        return task;
      }),
    })),
}));